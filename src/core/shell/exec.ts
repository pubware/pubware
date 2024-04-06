import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export async function shExec(cmd: string, ...args: string[]): Promise<void> {
  // NOTE: Simplistic joining of a command and args
  const unsafeCmd = `${cmd} ${args.join(' ')}`
  const { stdout, stderr } = await execPromise(unsafeCmd)

  if (stderr) {
    console.error(stderr)
    return
  }

  console.log(stdout)
}
