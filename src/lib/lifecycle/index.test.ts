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

  test('executes lifecycle events in order', async () => {
    const lifecycle = new Lifecycle()
    const callbackOne = jest.fn()
    const callbackTwo = jest.fn()
    const callbackThree = jest.fn()
    const callbackFour = jest.fn()

    lifecycle.on('postPublish', callbackOne)
    lifecycle.on('init', callbackTwo)
    lifecycle.on('preBump', callbackThree)
    lifecycle.on('preBump', callbackFour)

    await lifecycle.run()

    expect(callbackTwo.mock.invocationCallOrder[0]).toBeLessThan(
      callbackThree.mock.invocationCallOrder[0]
    )
    expect(callbackThree.mock.invocationCallOrder[0]).toBeLessThan(
      callbackFour.mock.invocationCallOrder[0]
    )
    expect(callbackFour.mock.invocationCallOrder[0]).toBeLessThan(
      callbackOne.mock.invocationCallOrder[0]
    )
  })
})
