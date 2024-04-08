import semver, { ReleaseType } from 'semver'
import Plugin from './plugin.js'

class NPM extends Plugin {
  // TODO: Replace with Config (pass in as props)
  static FILES = {
    PACKAGE_JSON_PATH: './package.json'
  }
  static CMDS = {
    BUILD: 'npm run build',
    PUBLISH: 'npm publish'
  }
  static FLAGS = {
    DRY_RUN: '--dry-run'
  }

  constructor() {
    super('npm')
  }

  async version(): Promise<string> {
    const data = await this.read(NPM.FILES.PACKAGE_JSON_PATH)
    const packageJson = JSON.parse(data)
    return packageJson.version
  }

  async bump(release: ReleaseType): Promise<string> {
    const data = await this.read(NPM.FILES.PACKAGE_JSON_PATH)
    const packageJson = JSON.parse(data)
    const version = semver.inc(packageJson.version, release)

    packageJson.version = version
    await this.write(
      NPM.FILES.PACKAGE_JSON_PATH,
      JSON.stringify(packageJson, null, 2) + '\n'
    )

    return version ?? ''
  }

  async build() {
    try {
      await this.exec(NPM.CMDS.BUILD)
    } catch (err) {
      console.error(err)
    }
  }

  async publish() {
    try {
      await this.exec(NPM.CMDS.PUBLISH, NPM.FLAGS.DRY_RUN)
    } catch (err) {
      console.error(err)
    }
  }
}

export default NPM
