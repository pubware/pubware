import { Command } from 'commander'
import chalk from 'chalk'
import Config from './config.js'
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
   * Log message to console.
   *
   * @param {string} message The message to log.
   */
  log(message: string) {
    console.log(chalk.black(`[packpub]: ${message}`))
  }

  /**
   * Execute CLI.
   */
  async run(args: string[]): Promise<void> {
    this.log('CLI initializing...')

    this.program.parse(args)

    const config = new Config()
    await config.init()

    const plugins = config.getPlugins()
    const lifecycle = new Lifecycle()

    for (const plugin of plugins) {
      for (const event of Lifecycle.EVENTS) {
        if (plugin[event]) {
          lifecycle.on(event, () => plugin[event]())
        }
      }
    }

    await lifecycle.run()

    this.log('CLI finished.')
  }
}

export default CLI
