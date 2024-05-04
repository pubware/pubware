class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  /**
   * Log message to console.
   *
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(`[packpub][${this.context}]: ${message}`)
  }
}

export default Logger
