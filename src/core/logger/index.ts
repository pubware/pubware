import chalk from 'chalk'

class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  log(message: string) {
    console.log(`[packpub][plugin][${this.context}]: ${message}`)
  }

  logInfo(message: string) {
    console.log(chalk.blue(`[packpub][plugin][${this.context}]: ${message}`))
  }

  logError(message: string) {
    console.error(
      chalk.red(`[packpub][plugin][${this.context}][error]: ${message}`)
    )
  }
}

export default Logger
