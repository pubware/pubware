import fs from 'node:fs/promises'
import Logger from './logger.js'

class Config {
  private static INTERNAL_PLUGINS: Record<string, object> = {
    npm: {}
  }
  private plugins: any[]
  private logger: Logger

  constructor() {
    this.plugins = []
    this.logger = new Logger()
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

  async init(): Promise<void> {
    const data = await fs.readFile('package.json', 'utf-8')
    const packageJson = JSON.parse(data)
    const { packpub } = packageJson

    let plugins = Config.INTERNAL_PLUGINS

    if (packpub) {
      const { plugins: externalPlugins } = packpub
      plugins = { ...plugins, ...externalPlugins }
    }

    for (const [name, options] of Object.entries(plugins)) {
      const Plugin = await this.load(name)
      this.plugins.push(new Plugin({ name, options }))
    }
  }

  getPlugins(): any[] {
    return this.plugins
  }
}

export default Config
