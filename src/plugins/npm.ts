import semver, { ReleaseType } from 'semver'
import Plugin from './plugin.js'
// TODO import { Choices } from '@packpub/plugin'
import { Choices } from '../core/shell/prompter/index.js'

interface Config {
  packageJsonPath: string
  buildCmd: string
  publishCmd: string
}

interface Options {
  config?: Config
}

class NPM extends Plugin {
  private static BUMP_PROMPT_QUESTION: string =
    'What type of update do you want to perform?'
  private static BUMP_PROMPT_CHOICES: Choices = [
    {
      name: 'patch',
      value: 'patch',
      description: 'Patch (x.x.1)'
    },
    {
      name: 'minor',
      value: 'minor',
      description: 'Minor (x.1.x)'
    },
    {
      name: 'major',
      value: 'major',
      description: 'Major (1.x.x)'
    }
  ]
  private config: Config

  constructor({ config }: Options) {
    super('npm')
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
      const version = semver.inc(packageJson.version, response as ReleaseType)

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
        // TODO Check against this.flags.dryRun
        '--dry-run'
      )
    } catch (err) {
      throw err
    }
  }
}

export default NPM
