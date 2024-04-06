import Plugin from './plugin.js'

class Git extends Plugin {
  static CLI = {
    CMD: {
      COMMIT: 'git commit',
      TAG: 'git tag',
      PUSH: 'git push'
    },
    OPTIONS: {
      ANNOTATE: '-a',
      MESSAGE: '-m'
    }
  }

  constructor() {
    super('git')
  }

  async commit(message: string) {
    try {
      await this.exec(Git.CLI.CMD.COMMIT, Git.CLI.OPTIONS.MESSAGE, message)
    } catch (err) {
      console.error(err)
    }
  }

  async tag(version: string): Promise<string> {
    const vers = `v${version}`
    try {
      await this.exec(
        Git.CLI.CMD.TAG,
        Git.CLI.OPTIONS.ANNOTATE,
        vers,
        Git.CLI.OPTIONS.MESSAGE,
        vers
      )
      return vers
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  async push(tag: string) {
    try {
      await this.exec(Git.CLI.CMD.PUSH, tag)
    } catch (err) {
      console.error(err)
    }
  }
}

export default Git
