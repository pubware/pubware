import semver, { ReleaseType } from 'semver'
import Plugin from './plugin.js'

const PACKAGE_JSON_PATH = './package.json'
const BUILD_CMD = 'npm run build'

class NPM extends Plugin {
  constructor() {
    super('npm')
  }

  async getVersion() {
    const data = await this.read(PACKAGE_JSON_PATH)
    const packageJson = JSON.parse(data)
    return packageJson.version
  }

  async bump(release: ReleaseType): Promise<string> {
    const data = await this.read(PACKAGE_JSON_PATH)
    const packageJson = JSON.parse(data)
    const version = semver.inc(packageJson.version, release)

    packageJson.version = version
    await this.write(
      PACKAGE_JSON_PATH,
      JSON.stringify(packageJson, null, 2) + '\n'
    )

    return version ?? ''
  }

  async build() {
    try {
      await this.exec(BUILD_CMD)
    } catch (err) {
      console.error(err)
    }
  }

  async publish() {
    // TODO
  }
}

export default NPM
