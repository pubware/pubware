import semver, { ReleaseType } from 'semver'
import Plugin from './plugin.js'

class NPM extends Plugin {
  static CLI = {
    // TODO: Remove `CONFIG` prop and use from Config class
    CONFIG: {
      PACKAGE_JSON_PATH: './package.json'
    },
    CMD: {
      BUILD: 'npm run build',
      PUBLISH: 'npm publish'
    },
    OPTIONS: {
      DRY_RUN: '--dry-run'
    }
  }

  constructor() {
    super('npm')
  }

  async version(): Promise<string> {
    const data = await this.read(NPM.CLI.CONFIG.PACKAGE_JSON_PATH)
    const packageJson = JSON.parse(data)
    return packageJson.version
  }

  async bump(release: ReleaseType): Promise<string> {
    const data = await this.read(NPM.CLI.CONFIG.PACKAGE_JSON_PATH)
    const packageJson = JSON.parse(data)
    const version = semver.inc(packageJson.version, release)

    packageJson.version = version
    await this.write(
      NPM.CLI.CONFIG.PACKAGE_JSON_PATH,
      JSON.stringify(packageJson, null, 2) + '\n'
    )

    return version ?? ''
  }

  async build() {
    try {
      await this.exec(NPM.CLI.CMD.BUILD)
    } catch (err) {
      console.error(err)
    }
  }

  async publish() {
    try {
      await this.exec(NPM.CLI.CMD.PUBLISH, NPM.CLI.OPTIONS.DRY_RUN)
    } catch (err) {
      console.error(err)
    }
  }
}

export default NPM
