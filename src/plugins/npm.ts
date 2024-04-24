// TODO
// import Plugin, { Choices } from '@packpub/plugin'
import semver, { ReleaseType } from 'semver'
import Plugin from './plugin.js'
import { Choices } from '../core/prompter/index.js'

interface Config {
  packageJsonPath: string
  buildCmd: string
  publishCmd: string
  preReleaseId: string
}

interface Options {
  config?: Config
}

class NPM extends Plugin {
  private static BUMP_PROMPT_QUESTION: string =
    'What type of update do you want to perform?'
  // TODO Make choices dynamic to only include pre-* if `releaseIdentifer` is defined
  private static BUMP_PROMPT_CHOICES: Choices = [
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
    },
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
  private config: Config

  constructor({ config }: Options) {
    super('npm')
    this.config = {
      packageJsonPath: config?.packageJsonPath ?? './package.json',
      buildCmd: config?.buildCmd ?? 'npm run build',
      publishCmd: config?.publishCmd ?? 'npm publish',
      preReleaseId: config?.preReleaseId ?? ''
    }
  }

  private async version(): Promise<string> {
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
    const version = await this.version()
    this.log(`Package version: ${version}`)
  }

  private async build(): Promise<void> {
    try {
      await this.exec(this.config.buildCmd)
    } catch (err) {
      throw err
    }
  }

  async preBump(): Promise<void> {
    await this.build()
    await this.logVersion()
  }

  async bump(): Promise<void> {
    const response = await this.promptSelect(
      NPM.BUMP_PROMPT_QUESTION,
      NPM.BUMP_PROMPT_CHOICES
    )

    try {
      const data = await this.read(this.config.packageJsonPath)
      const packageJson = JSON.parse(data)
      const version = semver.inc(
        packageJson.version,
        response as ReleaseType,
        this.config.preReleaseId
      )

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

  async prePublish(): Promise<void> {
    await this.logVersion()
  }

  async publish(): Promise<void> {
    try {
      await this.exec(
        this.config.publishCmd,
        // TODO Check against `this.flags.dryRun` once ready for prod
        '--dry-run'
      )
    } catch (err) {
      throw err
    }
  }
}

export default NPM
