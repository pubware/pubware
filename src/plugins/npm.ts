import semver from 'semver'
import Plugin from './plugin.js'

interface Config {
  packageJsonPath: string
  buildCmd: string
  publishCmd: string
}

interface Options {
  name: string
  config?: Config
}

class NPM extends Plugin {
  private config: Config

  constructor({ name, config }: Options) {
    super(name)

    this.config = {
      packageJsonPath: config?.packageJsonPath ?? './package.json',
      buildCmd: config?.buildCmd ?? 'npm run build',
      publishCmd: config?.publishCmd ?? 'npm publish'
    }
  }

  private async version(): Promise<string> {
    try {
      const data = await this.read(this.config.packageJsonPath)
      const packageJson = JSON.parse(data)
      return packageJson.version
    } catch (err) {
      throw err
    }
  }

  private async build(): Promise<void> {
    try {
      await this.exec(this.config.buildCmd)
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
      const data = await this.read(this.config.packageJsonPath)
      const packageJson = JSON.parse(data)
      const version = semver.inc(packageJson.version, 'patch')

      if (!version) {
        throw new Error('Semver failed to bump package version')
      }

      packageJson.version = version

      await this.write(
        this.config.packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n'
      )
    } catch (err) {
      throw err
    }
  }

  async publish(): Promise<void> {
    try {
      await this.exec(this.config.publishCmd, '--dry-run')
    } catch (err) {
      throw err
    }
  }
}

export default NPM
