import semver, { ReleaseType } from 'semver'
import { fsRead } from '../fs/read.js'
import { fsWrite } from '../fs/write.js'

export async function updateVersion(path: string, release: ReleaseType) {
  const data = await fsRead(path)
  const packageJson = JSON.parse(data)
  const newVersion = semver.inc(packageJson.version, release)

  packageJson.version = newVersion

  await fsWrite(path, JSON.stringify(packageJson, null, 2) + '\n')
}
