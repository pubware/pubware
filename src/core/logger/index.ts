import chalk from 'chalk'

class Logger {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  log(message: string) {
    console.log(`[packpub][plugin][${this.name}]: ${message}`)
  }

  logInfo(message: string) {
    console.log(chalk.blue(`[packpub][plugin][${this.name}]: ${message}`))
  }

  logError(message: string) {
    console.error(
      chalk.red(`[packpub][plugin][${this.name}][error]: ${message}`)
    )
  }
}

export default Logger
