import { Command } from 'commander'
import Logger from './logger/index.js'
import Config from './config.js'
import Lifecycle from './lifecycle/index.js'

export interface Flags {
  dryRun?: boolean
  headless?: boolean
}

type Options = {
  [key in keyof Flags]: {
    arg: string
    description: string
  }
}

class CLI {
  private static NAME: string = 'packpub'
  private static DESCRIPTION: string = 'Agnostic & extensible package publisher'
  private static VERSION: string = '0.0.0'
  private static OPTIONS: Options = {
    dryRun: {
      arg: '--dry-run',
      description: 'Report on what changes would have happened'
    },
    headless: {
      arg: '--headless',
      description: 'Run without an interface'
    }
  }
  private program: Command
  private logger: Logger

  constructor() {
    this.program = new Command()
    this.program
      .name(CLI.NAME)
      .description(CLI.DESCRIPTION)
      .version(CLI.VERSION)

    for (const option of Object.values(CLI.OPTIONS)) {
      this.program.option(option.arg, option.description)
    }

    this.logger = new Logger('cli')
  }

  private parseOptions(args: string[]): Flags {
    this.program.parse(args)
    return this.program.opts()
  }

  private logEnabledFlags(flags: Flags) {
    for (const flag of Object.keys(flags)) {
      this.logger.log(`Flag enabled: ${CLI.OPTIONS[flag as keyof Flags]?.arg}`)
    }
  }

  /**
   * Execute CLI.
   */
  async run(args: string[]): Promise<void> {
    this.logger.log('Started.')

    const flags = this.parseOptions(args)

    this.logEnabledFlags(flags)

    const lifecycle = new Lifecycle()
    const config = new Config()
    await config.init(flags)

    for (const plugin of config.plugins) {
      for (const event of Lifecycle.EVENTS) {
        if (plugin[event]) {
          lifecycle.on(event, () => plugin[event]())
        }
      }
    }

    await lifecycle.run()

    this.logger.log('Finished.')
  }
}

export default CLI
