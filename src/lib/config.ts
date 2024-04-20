import fs from 'node:fs/promises'
import Logger from './logger.js'

const INTERNAL_PLUGINS = {
  npm: {}
}

class Config {
  private plugins: any[]
  private logger: Logger

  constructor() {
    this.plugins = []
    this.logger = new Logger()
  }

  private async load(name: string) {
    this.logger.log(`Loading plugin: ${name}`)

    let Plugin

    try {
      const module = await import(name)
      Plugin = module.default
      return Plugin
    } catch (err) {
      try {
        // Attempt to load local plugin
        const module = await import(`../plugins/${name}.js`)
        Plugin = module.default
        return Plugin
      } catch (err) {
        throw err
      }
    }
  }

  async init() {
    const data = await fs.readFile('package.json', 'utf-8')
    const packageJson = JSON.parse(data)
    const { packpub } = packageJson

    let plugins = INTERNAL_PLUGINS

    if (packpub) {
      const { plugins: externalPlugins } = packpub
      plugins = { ...INTERNAL_PLUGINS, ...externalPlugins }
    }

    for (const [key, _] of Object.entries(plugins)) {
      const Plugin = await this.load(key)
      this.plugins.push(new Plugin())
    }
  }

  getPlugins() {
    return this.plugins
  }
}

export default Config
