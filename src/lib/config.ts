import fs from 'node:fs/promises'
import Logger from './logger.js'
import { Flags } from './cli.js'

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
    npm: {}
  }
  private _plugins: any[]
  private logger: Logger

  constructor() {
    this._plugins = []
    this.logger = new Logger('config')
  }

  plugins(): any[] {
    return this._plugins
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
    this.logger.log(`Loading plugin: ${plugin}`)

    let Plugin

    try {
      // Attempt to load plugin from node_modules
      const module = await import(plugin)
      Plugin = module.default
      return Plugin
    } catch (err) {
      try {
        // Attempt to load local plugin
        const module = await import(`../plugins/${plugin}.js`)
        Plugin = module.default
        return Plugin
      } catch (err) {
        throw err
      }
    }
  }

  async init(flags: Flags): Promise<void> {
    const data = await fs.readFile('package.json', 'utf-8')
    const packageJson = this.parseJson(data)
    const { packpub } = packageJson

    // Load internal plugins before external
    let pluginConfigs = Config.INTERNAL_PLUGINS

    if (packpub && packpub.plugins) {
      const { plugins } = packpub
      const { internal, external } = plugins

      if (internal) {
        pluginConfigs = {
          ...pluginConfigs,
          npm: internal?.npm,
          git: internal?.git
        }
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
