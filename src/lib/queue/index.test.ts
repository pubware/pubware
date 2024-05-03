import Queue from './index.js'

describe('Queue', () => {
  test('inserts items', () => {
    const queue = new Queue()
    queue.insert(1)
    expect(queue.size()).toBe(1)
  })

  test('removes items', () => {
    const queue = new Queue()
    queue.insert(1)
    queue.remove()
    expect(queue.size()).toBe(0)
  })

  test('throws error when removing item from empty queue', () => {
    expect(() => {
      const queue = new Queue()
      queue.remove()
    }).toThrow('Cannot remove from an empty queue')
  })

  test('peeks into front', () => {
    const queue = new Queue()
    queue.insert(1)
    queue.insert(2)
    expect(queue.peek()).toBe(1)
  })

  test('throws error when peeking into empty queue', () => {
    expect(() => {
      const queue = new Queue()
      queue.peek()
    }).toThrow('Cannot peek into an empty queue')
  })

  test('retrieves size', () => {
    const queue = new Queue()
    queue.insert('hello')
    expect(queue.size()).toBe(1)
  })

  test('checks if empty', () => {
    const queue = new Queue()
    queue.insert(1)
    queue.remove()
    expect(queue.isEmpty()).toBe(true)
  })
})
