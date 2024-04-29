import Plugin from './plugin.js'

interface Config {
  packageJsonPath: string
  tagCommit: boolean
  preReleaseId: string
  buildCmd: string
  versionArgs: string
  publishArgs: string
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
      tagCommit: config?.tagCommit ?? false,
      preReleaseId: config?.preReleaseId ?? '',
      buildCmd: config?.buildCmd ?? 'npm run build',
      versionArgs: config?.versionArgs ?? '',
      publishArgs: config?.publishArgs ?? ''
    }
  }

  private async getPackageVersion(): Promise<string> {
    const data = await this.read(this.config.packageJsonPath)

    try {
      const packageJson = JSON.parse(data)
      return packageJson.version
    } catch (err) {
      throw new Error('Failed to parse package json')
    }
  }

  private async logVersion(): Promise<void> {
    const version = await this.getPackageVersion()
    this.log(`Package version: ${version}`)
  }

  private async build(): Promise<void> {
    await this.exec(this.config.buildCmd)
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
    await this.exec(
      'npm version',
      response,
      this.config.versionArgs,
      this.config.tagCommit
        ? '--git-tag-version=true'
        : '--git-tag-version=false'
    )
  }

  async prePublish(): Promise<void> {
    await this.logVersion()
  }

  async publish(): Promise<void> {
    await this.exec(
      'npm publish',
      this.config.publishArgs,
      // TODO Check against `this.flags.dryRun` once ready for prod
      '--dry-run'
    )
  }
}

export default NPM
