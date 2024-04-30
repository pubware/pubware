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

  async commit() {
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
      await this.exec('git commit', '-m', message, '--dry-run')
    } catch (err) {
      throw err
    }
  }

  async tag(): Promise<string> {
    const version = await this.getPackageVersion()
    const tag = `v${version}`

    try {
      await this.exec('git tag', '-a', tag, '-m', tag)
      return tag
    } catch (err) {
      throw err
    }
  }

  async push(remote?: string, tag?: string) {
    try {
      let options = []

      if (remote) {
        options.push(remote)
      }

      if (tag) {
        options.push('refs/tags/' + tag)
      }

      await this.exec('git push', ...options, '--dry-run')
    } catch (err) {
      throw err
    }
  }

  async postPublish(): Promise<void> {
    await this.commit()

    if (this.config.tagVersion) {
      const tag = await this.tag()
      await this.push(this.config.remote, tag)
    } else {
      await this.push(this.config.remote)
    }
  }
}

export default Git
