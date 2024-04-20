import { Command } from 'commander'
import Logger from './logger.js'
import Config from './config.js'
import Lifecycle from './lifecycle.js'

class CLI {
  private static NAME = 'packpub'
  private static DESCRIPTION = 'Agnostic & extensible package publisher'
  private static VERSION = '0.0.0'

  private program: Command
  private logger: Logger

  constructor() {
    this.program = new Command()
    this.program
      .name(CLI.NAME)
      .description(CLI.DESCRIPTION)
      .version(CLI.VERSION)
    this.logger = new Logger()
  }

  /**
   * Execute CLI.
   */
  async run(args: string[]): Promise<void> {
    this.logger.log('CLI initializing...')

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

    this.logger.log('CLI finished.')
  }
}

export default CLI
