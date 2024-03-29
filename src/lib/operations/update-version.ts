import semver, { ReleaseType } from 'semver'
import { fsRead } from '../fs/read.js'
import { fsWrite } from '../fs/write.js'

export async function updateVersion(
  path: string,
  release: ReleaseType
): Promise<string> {
  const data = await fsRead(path)
  const packageJson = JSON.parse(data)
  const version = semver.inc(packageJson.version, release)

  packageJson.version = version
  await fsWrite(path, JSON.stringify(packageJson, null, 2) + '\n')

  return version ?? ''
}
