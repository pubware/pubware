type PluginContext = 'info' | 'warn' | 'error'

class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  private pluginContext(type?: PluginContext): string {
    const consoleContext = `[packpub][plugin][${this.context}]`

    if (type === 'info') {
      return `${consoleContext}[info]`
    } else if (type === 'warn') {
      return `${consoleContext}[warning]`
    } else if (type === 'error') {
      return `${consoleContext}[error]`
    }

    return consoleContext
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
