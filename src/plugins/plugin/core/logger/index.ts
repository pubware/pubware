type PluginContext = 'info' | 'warn' | 'error'

/**
 * Class for logging plugin messages.
 */
class Logger {
  private context: string

  /**
   * Creates an instance of Logger.
   * @param {string} context The context of the plugin using this logger.
   */
  constructor(context: string) {
    this.context = context
  }

  /**
   * Generates a log prefix based on the plugin context and log type.
   * @param {PluginContext} [type] The type of log message.
   * @returns {string} The formatted log prefix.
   */
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

  /**
   * Logs a generic message.
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(`${this.pluginContext()}: ${message}`)
  }

  /**
   * Logs an informational message.
   * @param {string} message The message to log.
   */
  info(message: string) {
    console.log(`${this.pluginContext('info')}: ${message}`)
  }

  /**
   * Logs a warning message.
   * @param {string} message The warning message to log.
   */
  warn(message: string) {
    console.log(`${this.pluginContext('warn')}: ${message}`)
  }

  /**
   * Logs an error message.
   * @param {string} message The error message to log.
   */
  error(message: string) {
    console.error(`${this.pluginContext('error')}: ${message}`)
  }
}

export default Logger
