import Plugin from './plugin.js'

class Git extends Plugin {
  constructor() {
    super('git')
  }

  commit() {}
  tag() {}
  push() {}
}

export default Git
