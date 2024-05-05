import fs from 'node:fs/promises'
import path from 'node:path'
import Logger from '../logger/index.js'
import { Flags } from '../cli/index.js'

/*
 * Example config:
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

  constructor() {
    this._plugins = []
    this.logger = new Logger('config')
  }

  get plugins(): any[] {
    return this._plugins
  }

  private getPluginName(name: string) {
    return name.startsWith('.') ? path.parse(name).name : name
  }

  private parseJson(data: string): any {
    try {
      const json = JSON.parse(data)
      return json
    } catch (_) {
      throw new Error('Failed to parse json')
    }
  }

  private async load(plugin: string): Promise<any> {
    this.logger.log(`Loading plugin: ${this.getPluginName(plugin)}`)

    let Plugin

    try {
      // Attempt to load plugin from node_modules
      // const module = await import(plugin)
      // TODO Remove once `npm` module is imported
      const module = await import(`../plugins/${plugin}.js`)
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

  private async readConfigFile(): Promise<any> {
    try {
      const data = await fs.readFile('packpub.json', 'utf-8')
      return this.parseJson(data)
    } catch {
      const data = await fs.readFile('package.json', 'utf-8')
      return this.parseJson(data)
    }
  }

  async init(flags: Flags): Promise<void> {
    const data = await this.readConfigFile()
    const { packpub } = data

    // Load internal plugins before external
    let pluginConfigs = Config.INTERNAL_PLUGINS

    if (packpub && packpub.plugins) {
      const { internal, external } = packpub.plugins

      if (internal) {
        Object.keys(Config.INTERNAL_PLUGINS).forEach(key => {
          if (internal[key] && internal[key].disabled) {
            // Do not load the plugin if it is disabled
            this.logger.log(`Skipping disabled plugin: ${key}`)
          } else {
            // Merge the configurations if the plugin is not disabled
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
