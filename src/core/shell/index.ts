import { exec as nodeExec } from 'child_process'
import util from 'util'
import Prompter, { Choices } from './prompter/index.js'
import Logger from './logger/index.js'

const execPromise = util.promisify(nodeExec)

class Shell {
  public logger: Logger
  public prompter: Prompter

  constructor(name: string) {
    this.logger = new Logger(name)
    this.prompter = new Prompter()
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    // NOTE: Simplistic joining of a command and args
    try {
      const unsafeCmd = `${cmd} ${args.join(' ')}`
      const { stdout, stderr } = await execPromise(unsafeCmd)

      if (stderr) {
        console.error(stderr)
        return
      }

      console.log(stdout)
    } catch (err) {
      throw err
    }
  }
}

export default Shell
