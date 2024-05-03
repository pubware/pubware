import Logger from './logger.js'
import Queue from './queue/index.js'

type Event =
  | 'init'
  | 'preBump'
  | 'bump'
  | 'prePublish'
  | 'publish'
  | 'postPublish'
type Callback<T extends any[], R> = (...args: T) => Promise<R> | R
type Hooks = Record<Event, Queue<Callback<any[], any>>>

class Lifecycle {
  static EVENTS: Event[] = [
    'init',
    'preBump',
    'bump',
    'prePublish',
    'publish',
    'postPublish'
  ]
  private hooks: Hooks = {} as Hooks
  private logger: Logger

  constructor() {
    Lifecycle.EVENTS.forEach(EVENT => {
      this.hooks[EVENT] = new Queue<Callback<any[], any>>()
    })
    this.logger = new Logger('lifecycle')
  }

  on<T extends any[], R>(event: Event, cb: Callback<T, R>): this {
    this.hooks[event].insert(cb)
    return this
  }

  async trigger(event: Event): Promise<void> {
    this.logger.log(`Executing hooks for lifecycle event: ${event}`)

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
      await this.trigger(event)
    }
  }
}

export default Lifecycle
