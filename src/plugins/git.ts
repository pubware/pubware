import Plugin from './plugin.js'

const GIT_COMMIT_CMD = 'git commit'
const GIT_TAG_CMD = 'git tag'
const GIT_PUSH_CMD = 'git push'

class Git extends Plugin {
  constructor() {
    super('git')
  }

  async commit(message: string) {
    try {
      await this.exec(`${GIT_COMMIT_CMD} -m ${message}`)
    } catch (err) {
      console.error(err)
    }
  }

  async tag(version: string): Promise<string> {
    const vers = `v${version}`
    try {
      await this.exec(`${GIT_TAG_CMD} -a ${vers} -m ${vers}`)
      return vers
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  async push(tag: string) {
    try {
      await this.exec(`${GIT_PUSH_CMD} origin ${tag}`)
    } catch (err) {
      console.error(err)
    }
  }
}

export default Git
