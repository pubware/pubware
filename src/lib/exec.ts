import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export async function shellExec(cmd: string): Promise<void> {
  try {
    const { stdout, stderr } = await execPromise(cmd)

    if (stderr) {
      console.error('Error:', stderr)
    }

    console.log('Output:', stdout)
  } catch (error) {
    console.error('Execution error:', error)
  }
}
