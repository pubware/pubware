import { jest } from '@jest/globals'
import Logger from './index.js'

describe('Logger', () => {
  let consoleLogSpy: jest.SpiedFunction<{ (message?: string): void }>
  let consoleErrorSpy: jest.SpiedFunction<{ (message?: string): void }>

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  test('logs message', () => {
    const logger = new Logger('test')
    logger.log('Hello, world!')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[packpub][plugin][test]: Hello, world!'
    )
  })

  test('logs info message', () => {
    const logger = new Logger('test')
    logger.info('Information message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[packpub][plugin][test][info]: Information message'
    )
  })

  test('logs warning message', () => {
    const logger = new Logger('test')
    logger.warn('Warning message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[packpub][plugin][test][warning]: Warning message'
    )
  })

  test('logs error message', () => {
    const logger = new Logger('test')
    logger.error('Error message')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[packpub][plugin][test][error]: Error message'
    )
  })
})
