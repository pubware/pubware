import chalk from 'chalk'
import { Command } from 'commander'

const NAME = 'packpub'
const DESCRIPTION = 'CLI tool to publish packages'
const VERSION = '0.0.0'

class CLI {
  private program: Command

  constructor() {
    this.program = new Command()
    this.program
      .name(NAME)
      .description(chalk.blue(DESCRIPTION))
      .version(chalk.yellow(VERSION))
  }

  run(args: string[]) {
    this.program.parse(args)
  }
}

export default CLI
