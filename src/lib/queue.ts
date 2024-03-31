interface GenericQueue<T> {
  push(item: T): void
  pop(): T | undefined
}

class Queue<T> implements GenericQueue<T> {
  private queue: T[]

  constructor() {
    this.queue = []
  }

  push(item: T) {
    this.queue.push(item)
  }

  pop(): T | undefined {
    return this.queue.shift()
  }
}

export default Queue
