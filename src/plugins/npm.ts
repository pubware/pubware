import semver from 'semver'
import Plugin from './plugin.js'

interface Config {
  tagCommit: boolean
  preReleaseId: string
  buildCmd: string
  versionArgs: string
  publishArgs: string
  defaults: {
    bump: string
  }
}

interface Options {
  config?: Config
}

class NPM extends Plugin {
  private config: Config

  constructor({ config }: Options) {
    super('npm')
    this.config = {
      tagCommit: config?.tagCommit ?? false,
      preReleaseId: config?.preReleaseId ?? '',
      defaults: {
        bump: config?.defaults?.bump ?? ''
      },
      buildCmd: config?.buildCmd ?? 'npm run build',
      versionArgs: config?.versionArgs ?? '',
      publishArgs: config?.publishArgs ?? ''
    }
  }

  private async getPackageVersion(): Promise<string> {
    const data = await this.read('./package.json')

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

  private isValidVersion(version: string): boolean {
    return semver.valid(version) !== null
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

    const choice = await this.promptSelect(
      'What type of update do you want to perform?',
      choices,
      this.config.defaults.bump
    )

    if (!this.isValidVersion(choice)) {
      throw new Error('Version bump must return a valid semver string')
    }

    return choice
  }

  async preBump(): Promise<void> {
    await this.build()
    await this.logVersion()
  }

  async bump(): Promise<void> {
    const version = await this.promptBump()
    const { versionArgs, tagCommit } = this.config
    await this.exec(
      `npm version ${version} ${versionArgs} ${
        tagCommit ? '--git-tag-version=true' : '--git-tag-version=false'
      }`
    )
  }

  async prePublish(): Promise<void> {
    await this.logVersion()
  }

  async publish(): Promise<void> {
    await this.exec(`npm publish ${this.config.publishArgs}`)
  }
}

export default NPM
