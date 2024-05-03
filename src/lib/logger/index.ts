import chalk from 'chalk'

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
    console.log(chalk.black(`[packpub][${this.context}]: ${message}`))
  }
}

export default Logger
