type PluginContext = 'info' | 'warn' | 'error'

class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  private pluginContext(type?: PluginContext): string {
    if (type === 'info') {
      return `[packpub][plugin][${this.context}][info]`
    } else if (type === 'warn') {
      return `[packpub][plugin][${this.context}][warning]`
    } else if (type === 'error') {
      return `[packpub][plugin][${this.context}][error]`
    }

    return `[packpub][plugin][${this.context}]`
  }

  log(message: string) {
    console.log(`${this.pluginContext()}: ${message}`)
  }

  info(message: string) {
    console.log(`${this.pluginContext('info')}: ${message}`)
  }

  warn(message: string) {
    console.log(`${this.pluginContext('warn')}: ${message}`)
  }

  error(message: string) {
    console.error(`${this.pluginContext('error')}: ${message}`)
  }
}

export default Logger
