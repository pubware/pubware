import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export async function shExec(cmd: string): Promise<void> {
  const { stdout, stderr } = await execPromise(cmd)

  if (stderr) {
    console.error('Error:', stderr)
  }

  console.log('Output:', stdout)
}
