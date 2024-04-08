import { Command } from '@oclif/core'
import { input, confirm } from '@inquirer/prompts'
import chalk from 'chalk'

class CLI extends Command {
  static summary = 'CLI for publishing packages'
  static enableJsonFlag = true
  static args = {}
  static flags = {}

  /**
   * Log info message to console.
   *
   * @param {string} message The message to log.
   */
  public info(message: string) {
    this.log(chalk.blue(message))
  }

  /**
   * Prompt user for a message input.
   *
   * @param {string} message The message to log.
   * @return {Promise<string>} Returns answer to message.
   */
  public static async promptInput(message: string): Promise<string> {
    return await input({ message })
  }

  /**
   * Prompt user for a confirmation.
   *
   * @param {string} message The message to log.
   * @return {Promise<boolean>} Returns answer to message.
   */
  public static async promptConfirm(message: string): Promise<boolean> {
    return await confirm({ message })
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(CLI)

    this.info('Running CLI...')
  }
}

export default CLI
