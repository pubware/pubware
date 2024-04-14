import { Command } from 'commander'
import chalk from 'chalk'
import Lifecycle from './lifecycle.js'

class CLI {
  private static NAME = 'packpub'
  private static DESCRIPTION = 'Agnostic & extensible package publisher'
  private static VERSION = '0.0.0'

  private program: Command

  constructor() {
    this.program = new Command()
    this.program
      .name(CLI.NAME)
      .description(CLI.DESCRIPTION)
      .version(CLI.VERSION)
  }

  /**
   * Log info message to console.
   *
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(chalk.blue(message))
  }

  /**
   * Execute CLI.
   */
  async run(args: string[]): Promise<void> {
    this.log('CLI initializing...')

    this.program.parse(args)

    const lifecycle = new Lifecycle()

    lifecycle
      .on('pre-bump', () => console.log('Preparing to bump version!'))
      .on('pre-commit', () => console.log('Preparing to git commit and push!'))
      .on('post-publish', () => console.log('Just published!'))

    await lifecycle.start()

    this.log('CLI completed.')
  }
}

export default CLI
