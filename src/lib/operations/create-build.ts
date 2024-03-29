import { shExec } from '../shell/exec.js'

export async function createBuild() {
  try {
    await shExec('npm run build')
  } catch (err) {
    console.error(err)
  }
}
