import chalk from 'chalk'

class Logger {
  /**
   * Log message to console.
   *
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(chalk.black(`[packpub]: ${message}`))
  }
}

export default Logger
