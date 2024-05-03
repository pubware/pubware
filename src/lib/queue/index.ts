class Queue<T> {
  private items: T[]

  constructor() {
    this.items = []
  }

  insert(item: T) {
    this.items.push(item)
  }

  remove(): T {
    if (this.isEmpty) {
      throw new Error('Cannot remove from an empty queue')
    }

    return this.items.shift() as T
  }

  peek(): T {
    if (this.isEmpty) {
      throw new Error('Cannot peek into an empty queue')
    }

    return this.items[0]
  }

  get size(): number {
    return this.items.length
  }

  get isEmpty(): boolean {
    return this.size === 0
  }
}

export default Queue
