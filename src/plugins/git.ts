import Plugin from './plugin.js'

interface Config {
  commitVersion: boolean
  tagVersion: boolean
  remote: string
}

interface Options {
  config?: Config
}

class Git extends Plugin {
  private config: Config

  constructor({ config }: Options) {
    super('git')
    this.config = {
      commitVersion: config?.commitVersion ?? true,
      tagVersion: config?.tagVersion ?? true,
      remote: config?.remote ?? 'origin'
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

  async status() {
    await this.exec('git status', { write: false })
  }

  async add(...args: string[]) {
    await this.exec(`git add ${args.join(' ').trim()}`)
  }

  async stageAll() {
    await this.add('.')
  }

  async commit() {
    await this.stageAll()
    await this.status()

    const confirm = await this.promptConfirm(
      'Do you want to commit these changes?'
    )

    if (!confirm) {
      throw new Error('Failed to confirm commit changes')
    }

    let message = ''

    if (this.config.commitVersion) {
      const version = await this.getPackageVersion()
      this.log(`Using package version as commit message: ${version}`)
      message = version
    } else {
      message = await this.prompt('Set a commit message')
    }

    if (!message) {
      throw new Error('git commit must contain a message')
    }

    try {
      await this.exec(`git commit -m ${message}`)
    } catch (err) {
      throw err
    }
  }

  async tag(): Promise<string> {
    const version = await this.getPackageVersion()
    const tag = `v${version}`

    try {
      await this.exec(`git tag '-a' ${tag} '-m' ${tag}`)
      return tag
    } catch (err) {
      throw err
    }
  }

  async push(remote: string, tag: string = ''): Promise<void> {
    try {
      const options = [remote, tag].filter(Boolean)
      await this.exec(`git push ${options.join(' ')}`)
    } catch (err) {
      throw err
    }
  }

  async postPublish(): Promise<void> {
    await this.commit()
    await this.push(this.config.remote)

    if (this.config.tagVersion) {
      const tag = await this.tag()
      await this.push(this.config.remote, tag)
    }
  }
}

export default Git
