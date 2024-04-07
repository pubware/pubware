import chalk from 'chalk'
import { Command } from '@oclif/core'

class CLI extends Command {
  static summary = 'CLI for publishing packages'
  static enableJsonFlag = true
  static args = {}
  static flags = {}

  async run() {
    const { flags } = await this.parse(CLI)

    this.log(chalk.blue('Running CLI...'))
  }
}

export default CLI
