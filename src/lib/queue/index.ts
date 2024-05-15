/**
 * Class representing a generic queue data structure (FIFO).
 * @template T The type of elements in the queue.
 */
class Queue<T> {
  private items: T[]

  /**
   * Create an instance of Queue.
   */
  constructor() {
    this.items = []
  }

  /**
   * Get the number of items in the queue.
   * @returns {number} The number of items in the queue.
   */
  get size(): number {
    return this.items.length
  }

  /**
   * Check if the queue is empty.
   * @returns {boolean} True if the queue is empty, false otherwise.
   */
  get isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * Insert a new item into the queue.
   * @param {T} item The item to be inserted into the queue.
   */
  insert(item: T) {
    this.items.push(item)
  }

  /**
   * Remove and return the item from the queue.
   * @returns {T} The item removed from the queue.
   * @throws {Error} If the queue is empty.
   */
  remove(): T {
    if (this.isEmpty) {
      throw new Error('Cannot remove from an empty queue')
    }

    return this.items.shift() as T
  }

  /**
   * Peek into the front of the queue.
   * @returns {T} The item at the front of the queue.
   * @throws {Error} If the queue is empty.
   */
  peek(): T {
    if (this.isEmpty) {
      throw new Error('Cannot peek into an empty queue')
    }

    return this.items[0]
  }
}

export default Queue
