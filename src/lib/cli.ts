import { Command } from 'commander'
import Logger from './logger.js'
import Config from './config.js'
import Lifecycle from './lifecycle.js'

export interface Flags {
  dryRun?: boolean
  headless?: boolean
}

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
    this.program
      .option('-D, --dry-run', 'Report on what changes would have happened')
      .option('--headless', 'Run without an interface')
    this.logger = new Logger()
  }

  private parseOptions(args: string[]): Flags {
    this.program.parse(args)
    return this.program.opts()
  }

  /**
   * Execute CLI.
   */
  async run(args: string[]): Promise<void> {
    this.logger.log('CLI started.')

    const flags = this.parseOptions(args)
    const config = new Config()

    await config.init(flags)

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
