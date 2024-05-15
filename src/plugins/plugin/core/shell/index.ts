import { exec as nodeExec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(nodeExec)

/**
 * Class responsible for executing shell commands.
 */
class Shell {
  /**
   * Execute a shell command.
   * @param {string} cmd The main command to execute.
   * @param {...string} args Additional arguments to be passed to the command.
   * @returns {Promise<void>} A promise that resolves when the command has been executed.
   * @throws {Error} Throws an error if the command execution fails.
   */
  async exec(cmd: string, ...args: string[]): Promise<void> {
    try {
      const command = `${cmd} ${args.join(' ')}`.trim()
      const { stdout, stderr } = await execPromise(command)

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
