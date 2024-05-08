import { jest } from '@jest/globals'
import Logger from './index.js'

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('logs message to console', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})
    const logger = new Logger('test')
    logger.log('Hello, world!')

    expect(consoleLogSpy).toHaveBeenCalledWith('[packpub][test]: Hello, world!')
  })
})
