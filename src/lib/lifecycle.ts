import Queue from './queue.js'
import NPM from '../plugins/npm.js'
import Git from '../plugins/git.js'

type Event = 'pre-bump' | 'pre-commit' | 'post-publish'
type Callback<T extends any[], R> = (...args: T) => Promise<R> | R

interface Plugins {
  npm: NPM
  git: Git
}

class Lifecycle {
  private hooks: Record<Event, Queue<Callback<any[], any>>>
  private plugins: Plugins

  constructor() {
    this.hooks = {
      'pre-bump': new Queue<Callback<any[], any>>(),
      'pre-commit': new Queue<Callback<any[], any>>(),
      'post-publish': new Queue<Callback<any[], any>>()
    }
    this.plugins = {
      npm: new NPM(),
      git: new Git()
    }
  }

  on<T extends any[], R>(event: Event, cb: Callback<T, R>): this {
    this.hooks[event].insert(cb)
    return this
  }

  private async trigger(event: Event): Promise<void> {
    const callbacks = this.hooks[event]

    while (!callbacks.isEmpty()) {
      const cb = callbacks.remove()

      if (cb) {
        await cb()
      }
    }
  }

  async start(): Promise<void> {
    await this.trigger('pre-bump')
    // await this.plugins.npm.bump('patch')

    await this.trigger('pre-commit')
    // await this.plugins.git.commit()

    // await this.plugins.npm.publish()
    await this.trigger('post-publish')
  }
}

export default Lifecycle
