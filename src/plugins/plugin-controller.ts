import Queue from '../lib/queue.js'

type HookType = 'pre' | 'intra' | 'post'

class PluginController {
  private hooks: Record<HookType, Queue<Function>>

  constructor() {
    this.hooks = {
      pre: new Queue(),
      intra: new Queue(),
      post: new Queue()
    }
  }

  on(type: HookType, hook: Function): this {
    this.hooks[type].push(hook)
    return this
  }

  private async execHooks(type: HookType): Promise<void> {
    while (this.hooks[type].size() > 0) {
      const hook = this.hooks[type].pop()

      if (hook) {
        await hook()
      }
    }
  }

  async execAll(): Promise<void> {
    await this.execHooks('pre')
    await this.execHooks('intra')
    await this.execHooks('post')
  }
}

export default PluginController
