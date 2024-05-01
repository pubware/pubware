import { exec as nodeExec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(nodeExec)

class Shell {
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
