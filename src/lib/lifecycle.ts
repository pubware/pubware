import Logger from './logger.js'
import Queue from './queue.js'

type Event = 'beforeBump' | 'bump' | 'beforePublish' | 'publish' | 'postPublish'
type Callback<T extends any[], R> = (...args: T) => Promise<R> | R
type Hooks = Record<Event, Queue<Callback<any[], any>>>

class Lifecycle {
  static EVENTS: Event[] = [
    'beforeBump',
    'bump',
    'beforePublish',
    'publish',
    'postPublish'
  ]
  private hooks: Hooks = {} as Hooks
  private logger: Logger

  constructor() {
    Lifecycle.EVENTS.forEach(EVENT => {
      this.hooks[EVENT] = new Queue<Callback<any[], any>>()
    })
    this.logger = new Logger()
  }

  on<T extends any[], R>(event: Event, cb: Callback<T, R>): this {
    this.hooks[event].insert(cb)
    return this
  }

  async trigger(event: Event): Promise<void> {
    const callbacks = this.hooks[event]

    while (!callbacks.isEmpty()) {
      const callback = callbacks.remove()

      if (callback) {
        await callback()
      }
    }
  }

  async run(): Promise<void> {
    for (const event of Lifecycle.EVENTS) {
      this.logger.log(`Executing hooks for lifecycle event: ${event}`)
      await this.trigger(event)
    }
  }
}

export default Lifecycle
