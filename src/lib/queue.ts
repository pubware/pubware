interface GenericQueue<T> {
  push(item: T): void
  pop(): T | undefined
  size(): number
}

class Queue<T> implements GenericQueue<T> {
  private items: T[]

  constructor() {
    this.items = []
  }

  push(item: T) {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.shift()
  }

  size(): number {
    return this.items.length
  }
}

export default Queue
