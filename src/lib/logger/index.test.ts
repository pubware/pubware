import { jest } from '@jest/globals'
import Logger from './index.js'

describe('Logger', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('logs message to console', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})
    const logger = new Logger('test')
    logger.log('Hello, world!')

    expect(consoleLogSpy).toHaveBeenCalledWith('[pubware][test]: Hello, world!')
  })
})
