import Plugin from './plugin.js'

interface Config {
  packageJsonPath: string
  buildCmd: string
  versionArgs: string
  publishArgs: string
  preReleaseId: string
}

interface Options {
  config?: Config
}

class NPM extends Plugin {
  private config: Config

  constructor({ config }: Options) {
    super('npm')
    this.config = {
      packageJsonPath: config?.packageJsonPath ?? './package.json',
      buildCmd: config?.buildCmd ?? 'npm run build',
      versionArgs: config?.versionArgs ?? '',
      publishArgs: config?.publishArgs ?? '',
      preReleaseId: config?.preReleaseId ?? ''
    }
  }

  private async getPackageVersion(): Promise<string> {
    try {
      const data = await this.read(this.config.packageJsonPath)
      const packageJson = JSON.parse(data)
      const { version } = packageJson
      return version
    } catch (err) {
      throw err
    }
  }

  private async logVersion(): Promise<void> {
    const version = await this.getPackageVersion()
    this.log(`Package version: ${version}`)
  }

  private async build(): Promise<void> {
    try {
      await this.exec(this.config.buildCmd)
    } catch (err) {
      throw err
    }
  }

  private async promptBump(): Promise<string> {
    let choices = [
      {
        name: 'patch',
        value: 'patch',
        description: 'Patch'
      },
      {
        name: 'minor',
        value: 'minor',
        description: 'Minor'
      },
      {
        name: 'major',
        value: 'major',
        description: 'Major'
      }
    ]

    if (this.config.preReleaseId) {
      const preReleaseChoices = [
        {
          name: 'prepatch',
          value: 'prepatch',
          description: 'Prepatch'
        },
        {
          name: 'preminor',
          value: 'preminor',
          description: 'Preminor'
        },
        {
          name: 'premajor',
          value: 'premajor',
          description: 'Premajor'
        },
        {
          name: 'prerelease',
          value: 'prerelease',
          description: 'Prerelease'
        }
      ]

      choices = [...choices, ...preReleaseChoices]
    }

    return await this.promptSelect(
      'What type of update do you want to perform?',
      choices
    )
  }

  async preBump(): Promise<void> {
    await this.build()
    await this.logVersion()
  }

  async bump(): Promise<void> {
    const response = await this.promptBump()

    try {
      await this.exec('npm version', response, '--git-tag-version=false')
    } catch (err) {
      throw err
    }
  }

  async prePublish(): Promise<void> {
    await this.logVersion()
  }

  async publish(): Promise<void> {
    try {
      await this.exec(
        'npm publish',
        this.config.publishArgs,
        // TODO Check against `this.flags.dryRun` once ready for prod
        '--dry-run'
      )
    } catch (err) {
      throw err
    }
  }
}

export default NPM
