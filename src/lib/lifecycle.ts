import Queue from './queue.js'

type Event = 'pre-bump' | 'pre-commit' | 'post-publish'
type Callback<T extends any[], R> = (...args: T) => Promise<R> | R

class Lifecycle {
  private events: Map<Event, Queue<Callback<any[], any>>>

  constructor() {
    const events: Event[] = ['pre-bump', 'pre-commit', 'post-publish']
    this.events = new Map(
      events.map((event): [Event, Queue<Callback<any[], any>>] => [
        event,
        new Queue()
      ])
    )
  }

  on<T extends any[], R>(event: Event, cb: Callback<T, R>): this {
    const callbacks = this.events.get(event)

    if (callbacks) {
      callbacks.insert(cb)
      this.events.set(event, callbacks)
    }

    return this
  }

  async trigger(event: Event): Promise<void> {
    const callbacks = this.events.get(event)

    if (callbacks) {
      while (callbacks.size() > 0) {
        const callback = callbacks.remove()

        if (callback) {
          await callback()
        }
      }
    }
  }
}

export default Lifecycle
