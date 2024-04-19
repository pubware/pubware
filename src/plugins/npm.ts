import semver from 'semver'
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

  private async version(): Promise<string> {
    try {
      const data = await this.read(NPM.FILES.PACKAGE_JSON_PATH)
      const packageJson = JSON.parse(data)
      return packageJson.version
    } catch (err) {
      throw err
    }
  }

  private async build(): Promise<void> {
    try {
      await this.exec(NPM.CMDS.BUILD)
    } catch (err) {
      throw err
    }
  }

  async beforeBump(): Promise<void> {
    const version = await this.version()
    this.output(`Package version: ${version}`)

    this.output(`Running build...`)
    await this.build()
  }

  async bump(): Promise<void> {
    const response = await this.prompt('Which version?')

    try {
      const data = await this.read(NPM.FILES.PACKAGE_JSON_PATH)
      const packageJson = JSON.parse(data)
      const version = semver.inc(packageJson.version, 'patch')

      if (!version) {
        throw new Error('Semver failed to bump package version')
      }

      packageJson.version = version

      await this.write(
        NPM.FILES.PACKAGE_JSON_PATH,
        JSON.stringify(packageJson, null, 2) + '\n'
      )
    } catch (err) {
      throw err
    }
  }

  async publish(): Promise<void> {
    try {
      await this.exec(NPM.CMDS.PUBLISH, NPM.FLAGS.DRY_RUN)
    } catch (err) {
      throw err
    }
  }
}

export default NPM
