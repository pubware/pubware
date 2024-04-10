interface GenericQueue<T> {
  insert(item: T): void
  remove(): T | undefined
  peek(): T | undefined
  size(): number
}

class Queue<T> implements GenericQueue<T> {
  private items: T[]

  constructor() {
    this.items = []
  }

  insert(item: T) {
    this.items.push(item)
  }

  remove(): T | undefined {
    return this.items.shift()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  size(): number {
    return this.items.length
  }
}

export default Queue
