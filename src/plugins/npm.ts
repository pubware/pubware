import semver, { ReleaseType } from 'semver'
import Plugin from './plugin.js'

const PACKAGE_JSON_PATH = './package.json'
const NPM_BUILD_CMD = 'npm run build'
const NPM_PUBLISH_CMD = 'npm publish'

class NPM extends Plugin {
  constructor() {
    super('npm')
  }

  async version(): Promise<string> {
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
      await this.exec(NPM_BUILD_CMD)
    } catch (err) {
      console.error(err)
    }
  }

  async publish() {
    try {
      await this.exec(`${NPM_PUBLISH_CMD} --dry-run`)
    } catch (err) {
      console.error(err)
    }
  }
}

export default NPM
