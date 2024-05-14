import Logger from '../logger/index.js'
import Queue from '../queue/index.js'

type Event =
  | 'init'
  | 'preBump'
  | 'bump'
  | 'prePublish'
  | 'publish'
  | 'postPublish'
type Callback<T extends any[], R> = (...args: T) => Promise<R> | R
type Hooks = Record<Event, Queue<Callback<any[], any>>>

/**
 * Class responsible for managing and executing lifecycle events.
 */
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

  /**
   * Creates an instance of Lifecycle.
   */
  constructor() {
    Lifecycle.EVENTS.forEach(EVENT => {
      this.hooks[EVENT] = new Queue<Callback<any[], any>>()
    })
    this.logger = new Logger('lifecycle')
  }

  /**
   * Registers a callback for a specified event.
   * @param {Event} event The event to register the callback.
   * @param {Callback<T, R>} cb The callback function to be executed when the event is triggered.
   * @returns {this} The instance for chaining.
   * @template T Array of any type representing the callback parameters.
   * @template R The return type of the callback.
   */
  on<T extends any[], R>(event: Event, cb: Callback<T, R>): this {
    this.hooks[event].insert(cb)
    return this
  }

  /**
   * Triggers all callbacks associated with a given event.
   * @param {Event} event The event to trigger.
   */
  async trigger(event: Event): Promise<void> {
    this.logger.log(`Executing hooks for lifecycle event: ${event}`)

    const callbacks = this.hooks[event]

    while (!callbacks.isEmpty) {
      const callback = callbacks.remove()

      if (callback) {
        await callback()
      }
    }
  }

  /**
   * Sequentially triggers all lifecycle events.
   */
  async run(): Promise<void> {
    for (const event of Lifecycle.EVENTS) {
      await this.trigger(event)
    }
  }
}

export default Lifecycle
