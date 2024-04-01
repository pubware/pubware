import Queue from '../lib/queue.js'

type HookType = 'pre' | 'intra' | 'post'

class PluginManager {
  private hooks: Record<HookType, Queue<Function>>

  constructor() {
    this.hooks = {
      pre: new Queue(),
      intra: new Queue(),
      post: new Queue()
    }
  }

  addHook(type: HookType, hook: Function): this {
    this.hooks[type].push(hook)
    return this
  }

  private async executeHooks(type: HookType): Promise<void> {
    while (this.hooks[type].size() > 0) {
      const hook = this.hooks[type].pop()

      if (hook) {
        await hook()
      }
    }
  }

  async execAll(): Promise<void> {
    await this.executeHooks('pre')
    await this.executeHooks('intra')
    await this.executeHooks('post')
  }
}

export default PluginManager
