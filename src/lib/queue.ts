class Queue<T> {
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

  isEmpty(): boolean {
    return this.size() === 0
  }
}

export default Queue
