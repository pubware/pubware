import Queue from '../lib/queue.js'

type LifecycleEvent = 'pre' | 'intra' | 'post'
type Callback<T extends any[], R> = (...args: T) => Promise<R> | R

class PluginController {
  private hooks: Record<LifecycleEvent, Queue<Callback<any[], any>>>

  constructor() {
    this.hooks = {
      pre: new Queue<Callback<any[], any>>(),
      intra: new Queue<Callback<any[], any>>(),
      post: new Queue<Callback<any[], any>>()
    }
  }

  on<T extends any[], R>(
    event: LifecycleEvent,
    callback: Callback<T, R>
  ): this {
    this.hooks[event].push(callback)
    return this
  }

  private async exec(event: LifecycleEvent): Promise<void> {
    while (this.hooks[event].size() > 0) {
      const callback = this.hooks[event].pop()

      if (callback) {
        await callback()
      }
    }
  }

  async execAll(): Promise<void> {
    await this.exec('pre')
    await this.exec('intra')
    await this.exec('post')
  }
}

export default PluginController
