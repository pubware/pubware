import Plugin from './plugin.js'

class Git extends Plugin {
  // TODO: Replace with Config (pass in as props)
  static CMDS = {
    COMMIT: 'git commit',
    TAG: 'git tag',
    PUSH: 'git push'
  }
  static FLAGS = {
    ANNOTATE: '-a',
    MESSAGE: '-m'
  }

  constructor() {
    super('git')
  }

  async commit(message: string) {
    try {
      await this.exec(Git.CMDS.COMMIT, Git.FLAGS.MESSAGE, message)
    } catch (err) {
      console.error(err)
    }
  }

  async tag(version: string): Promise<string> {
    const vers = `v${version}`
    try {
      await this.exec(
        Git.CMDS.TAG,
        Git.FLAGS.ANNOTATE,
        vers,
        Git.FLAGS.MESSAGE,
        vers
      )
      return vers
    } catch (err) {
      console.error(err)
      return ''
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

      await this.exec(Git.CMDS.PUSH, ...options)
    } catch (err) {
      console.error(err)
    }
  }
}

export default Git
