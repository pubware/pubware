import Lifecycle from './index.js'

describe('Lifecycle', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.spyOn(console, 'log').mockRestore()
    jest.spyOn(console, 'error').mockRestore()
  })

  test('executes all callbacks for an event', async () => {
    const lifecycle = new Lifecycle()
    const callbackOne = jest.fn()
    const callbackTwo = jest.fn()

    lifecycle.on('init', callbackOne)
    lifecycle.on('init', callbackTwo)

    await lifecycle.trigger('init')

    expect(callbackOne).toHaveBeenCalled()
    expect(callbackTwo).toHaveBeenCalled()
    expect(callbackOne.mock.invocationCallOrder[0]).toBeLessThan(
      callbackTwo.mock.invocationCallOrder[0]
    )
  })

  test('handles errors without crashing', async () => {
    expect(async () => {
      const lifecycle = new Lifecycle()
      const callbackError = jest.fn(() => {
        throw new Error('Test Error')
      })

      lifecycle.on('init', callbackError)

      await lifecycle.trigger('init')
    }).rejects.toThrow('Test Error')
  })

  test('executes all lifecycle events', async () => {
    const lifecycle = new Lifecycle()
    const callbackOne = jest.fn()
    const callbackTwo = jest.fn()

    lifecycle.on('preBump', callbackTwo)
    lifecycle.on('init', callbackOne)

    await lifecycle.run()

    expect(callbackOne).toHaveBeenCalled()
    expect(callbackTwo).toHaveBeenCalled()
    expect(callbackOne.mock.invocationCallOrder[0]).toBeLessThan(
      callbackTwo.mock.invocationCallOrder[0]
    )
  })
})
