import Plugin from './plugin/index.js'

interface Config {
  commitVersion: boolean
  remote: string
  defaults: {
    message: string
  }
}

/**
 * Class representing a Git plugin.
 * @extends Plugin
 */
class Git extends Plugin {
  private config: Config

  /**
   * Create an instance of Git.
   * @param {Partial<Config>} config Config for the plugin.
   */
  constructor(config: Partial<Config>) {
    super('git')
    this.config = {
      commitVersion: config.commitVersion ?? true,
      remote: config.remote ?? 'origin',
      defaults: {
        message: config.defaults?.message ?? ''
      }
    }
  }

  /**
   * Read the version from the package.json file.
   * @returns {Promise<string>} The current package version.
   * @throws Throws an error if the package.json file cannot be parsed.
   */
  private async getPackageVersion(): Promise<string> {
    const data = await this.read('./package.json')

    try {
      const packageJson = JSON.parse(data)
      return packageJson.version
    } catch (err) {
      throw new Error('Failed to parse package json')
    }
  }

  /**
   * Display the git status.
   */
  async status() {
    await this.exec('git status', { write: false })
  }

  /**
   * Add files to the git staging area.
   * @param {...string} args The files.
   * @returns {Promise<void>}
   */
  async add(...args: string[]) {
    await this.exec(`git add ${args.join(' ').trim()}`)
  }

  /**
   * Stage all files.
   */
  async stageAll() {
    await this.add('.')
  }

  /**
   * Commit staged changes.
   * @throws Throws an error if the commit is not confirmed or if the commit message is empty.
   */
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
      message = await this.prompt(
        'Set a commit message',
        this.config.defaults.message
      )
    }

    if (!message) {
      throw new Error('git commit must contain a message')
    }

    try {
      const msg = message.replace(/"/g, '\\"')
      await this.exec(`git commit -m "${msg}"`)
    } catch (err) {
      throw err
    }
  }

  /**
   * Create a git tag with the current package version.
   * @returns {Promise<string>} The tag.
   * @throws Throws an error if the tag creation fails.
   */
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

  /**
   * Push commits and tags to the remote repository.
   * @param {string} remote The remote repository name.
   * @param {string} [tag=''] The tag to push.
   * @throws Throws an error if the push fails.
   */
  async push(remote: string, tag: string = ''): Promise<void> {
    try {
      const options = [remote, tag].filter(Boolean)
      await this.exec(`git push ${options.join(' ')}`)
    } catch (err) {
      throw err
    }
  }

  // Lifecycle hooks

  async postPublish(): Promise<void> {
    await this.commit()
    await this.push(this.config.remote)

    if (this.config.commitVersion) {
      const tag = await this.tag()
      await this.push(this.config.remote, tag)
    }
  }
}

export default Git
