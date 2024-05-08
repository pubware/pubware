import { jest } from '@jest/globals'
import Lifecycle from './index.js'

jest.mock('../logger/index.js')

const Logger = (await import('../logger/index.js')).default

describe('Lifecycle', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
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
