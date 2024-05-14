import { Command } from 'commander'
import Logger from '../lib/logger/index.js'
import Config from '../lib/config/index.js'
import Lifecycle from '../lib/lifecycle/index.js'
import { Flags } from '../lib/types.js'

type Options = {
  [key in keyof Flags]: {
    arg: string
    description: string
    default: string | boolean
  }
}

/**
 * CLI for the packpub publisher.
 */
class CLI {
  private static NAME: string = 'packpub'
  private static DESCRIPTION: string = 'Agnostic & extensible package publisher'
  private static VERSION: string = '0.0.0'
  private static OPTIONS: Options = {
    dryRun: {
      arg: '--dry-run',
      description: 'Report on what changes would have happened',
      default: false
    },
    headless: {
      arg: '--headless',
      description: 'Run without an interface',
      default: false
    }
  }
  private program: Command
  private logger: Logger

  /**
   * Creates an instance of CLI.
   */
  constructor() {
    this.program = new Command()
    this.program
      .name(CLI.NAME)
      .description(CLI.DESCRIPTION)
      .version(CLI.VERSION)

    for (const option of Object.values(CLI.OPTIONS)) {
      this.program.option(option.arg, option.description, option.default)
    }

    this.logger = new Logger('cli')
  }

  /**
   * Parses command line arguments.
   * @param {string[]} args The array of command line arguments.
   * @returns {Flags} An object containing the parsed flags.
   */
  private parseOptions(args: string[]): Flags {
    this.program.parse(args)
    return this.program.opts()
  }

  /**
   * Logs all enabled flags from the command line options.
   * @param {Flags} flags The flags parsed from the command line.
   */
  private logEnabledFlags(flags: Flags) {
    for (const flag of Object.keys(flags)) {
      this.logger.log(`Flag enabled: ${CLI.OPTIONS[flag as keyof Flags]?.arg}`)
    }
  }

  /**
   * Initializes configuration, sets up lifecycle events for plugins, and executes the lifecycle.
   * @param {string[]} args The command line arguments to process.
   * @returns {Promise<void>} A promise that resolves when the CLI has completed execution.
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
