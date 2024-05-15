/**
 * Class for logging messages.
 */
class Logger {
  private context: string

  /**
   * Create an instance of Logger.
   * @param {string} context The context of the logger.
   */
  constructor(context: string) {
    this.context = context
  }

  /**
   * Log a message with context.
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(`[packpub][${this.context}]: ${message}`)
  }
}

export default Logger
