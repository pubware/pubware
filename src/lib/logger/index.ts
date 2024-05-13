/**
 * Class for logging messages.
 */
class Logger {
  private context: string

  /**
   * Creates an instance of Logger.
   * @param {string} context The context of the logger.
   */
  constructor(context: string) {
    this.context = context
  }

  /**
   * Logs a message with the context.
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(`[packpub][${this.context}]: ${message}`)
  }
}

export default Logger
