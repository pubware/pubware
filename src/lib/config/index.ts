import fs from 'node:fs/promises'
import path from 'node:path'
import Logger from '../logger/index.js'
import { Flags } from '../../cli/index.js'

/**
 * Class for dynamic loading and configuration of plugins for the CLI.
 * Plugins are either internal (bundled with the application) or external (defined by the user).
 *
 * Example:
 * {
 *   "packpub": {
 *     "plugins": {
 *       "internal": {
 *         "npm": {},
 *         "git": {}
 *       },
 *       "external": {
 *         "github": {},
 *         "slack": {},
 *         "doordash": {}
 *       }
 *     }
 *   }
 * }
 */
class Config {
  private static INTERNAL_PLUGINS: Record<string, object> = {
    npm: {},
    git: {}
  }
  private _plugins: any[]
  private logger: Logger

  /**
   * Creates an instance of Config.
   */
  constructor() {
    this._plugins = []
    this.logger = new Logger('config')
  }

  /**
   * Gets the list of all loaded plugins.
   * @returns {any[]} Array of loaded plugin instances.
   */
  get plugins(): any[] {
    return this._plugins
  }

  /**
   * Determines the plugin name from a file path or module name.
   * If the name starts with '.', it is treated as a path and parsed to extract the name.
   * @param {string} name The plugin name or path.
   * @returns {string} The resolved plugin name.
   */
  private getPluginName(name: string) {
    return name.startsWith('.') ? path.parse(name).name : name
  }

  /**
   * Parses a JSON string into an object. Throws an error if parsing fails.
   * @param {string} data The JSON string to parse.
   * @returns {any} The parsed JSON object.
   * @throws {Error} If the JSON cannot be parsed.
   */
  private parseJson(data: string): any {
    try {
      const json = JSON.parse(data)
      return json
    } catch (_) {
      throw new Error('Failed to parse json')
    }
  }

  /**
   * Reads and parses the configuration file for the application.
   * First tries to read 'packpub.json', and if not found, reads 'package.json'.
   * @returns {Promise<any>} The parsed configuration object.
   */
  private async readConfigFile(): Promise<any> {
    try {
      const data = await fs.readFile('packpub.json', 'utf-8')
      return this.parseJson(data)
    } catch {
      const data = await fs.readFile('package.json', 'utf-8')
      return this.parseJson(data)
    }
  }

  /**
   * Dynamically loads a plugin module based on the plugin identifier.
   * Attempts to load from the node_modules directory first, then falls back to a local directory.
   * @param {string} plugin The plugin identifier or path.
   * @returns {Promise<any>} The loaded plugin module.
   * @throws {Error} If the plugin cannot be loaded from either location.
   */
  private async load(plugin: string): Promise<any> {
    this.logger.log(`Loading plugin: ${this.getPluginName(plugin)}`)

    let Plugin

    try {
      // Attempt to load plugin from node_modules
      // const module = await import(plugin)
      // TODO Remove once `npm` module is imported
      const module = await import(`../../plugins/${plugin}.js`)
      Plugin = module.default
      return Plugin
    } catch (err) {
      try {
        // Attempt to load local plugin
        const module = await import(path.join(process.cwd(), plugin))
        Plugin = module.default
        return Plugin
      } catch (err) {
        throw err
      }
    }
  }

  /**
   * Initializes plugins based on the application configuration and provided CLI flags.
   * Loads and configures both internal and external plugins.
   * @param {Flags} flags The CLI flags that might affect plugin behavior.
   * @returns {Promise<void>}
   */
  async init(flags: Flags): Promise<void> {
    const data = await this.readConfigFile()
    const { packpub } = data

    // Load internal plugins before external
    let pluginConfigs = structuredClone(Config.INTERNAL_PLUGINS)

    if (packpub && packpub.plugins) {
      const { internal, external } = packpub.plugins

      if (internal) {
        Object.keys(Config.INTERNAL_PLUGINS).forEach(key => {
          if (internal[key] && internal[key].disabled) {
            // Do not load plugin if disabled
            this.logger.log(`Skipping disabled plugin: ${key}`)
            delete pluginConfigs[key]
          } else {
            // Merge configurations
            pluginConfigs[key] = {
              ...Config.INTERNAL_PLUGINS[key],
              ...internal[key]
            }
          }
        })
      }

      if (external) {
        pluginConfigs = { ...pluginConfigs, ...external }
      }
    }

    for (const [name, config] of Object.entries(pluginConfigs)) {
      const Plugin = await this.load(name)
      const plugin = new Plugin({ config })

      // Map CLI flags to plugin
      plugin.flags = { dry: flags.dryRun, headless: flags.headless }

      this._plugins.push(plugin)
    }
  }
}

export default Config
