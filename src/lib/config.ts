import fs from 'node:fs/promises'
import Logger from './logger.js'
import { Flags } from './cli.js'

class Config {
  private static INTERNAL_PLUGINS: Record<string, object> = {
    npm: {}
  }
  private plugins: any[]
  private logger: Logger

  constructor() {
    this.plugins = []
    this.logger = new Logger('config')
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
    const packageJson = JSON.parse(data)
    const { packpub } = packageJson

    let plugins = Config.INTERNAL_PLUGINS

    if (packpub) {
      const { plugins: externalPlugins } = packpub
      plugins = { ...plugins, ...externalPlugins }
    }

    for (const [name, config] of Object.entries(plugins)) {
      const Plugin = await this.load(name)
      const plugin = new Plugin({ config })
      plugin.flags = flags
      this.plugins.push(plugin)
    }
  }

  getPlugins(): any[] {
    return this.plugins
  }
}

export default Config
