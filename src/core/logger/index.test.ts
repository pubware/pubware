import chalk from 'chalk'
import Logger from './index.js'

jest.mock('chalk', () => ({
  blue: jest.fn(text => `blue(${text})`),
  yellow: jest.fn(text => `yellow(${text})`),
  red: jest.fn(text => `red(${text})`)
}))

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  test('`log` logs with standard message and context', () => {
    const logger = new Logger('test')
    logger.log('Hello, world!')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[packpub][plugin][test]: Hello, world!'
    )
  })

  test('`info` logs with blue message and context', () => {
    const logger = new Logger('test')
    logger.info('Information message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'blue([packpub][plugin][test]: Information message)'
    )
    expect(chalk.blue).toHaveBeenCalledWith(
      '[packpub][plugin][test]: Information message'
    )
  })

  test('`warn` logs with yellow message and warning context', () => {
    const logger = new Logger('test')
    logger.warn('Warning message')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'yellow([packpub][plugin][test][warning]: Warning message)'
    )
    expect(chalk.yellow).toHaveBeenCalledWith(
      '[packpub][plugin][test][warning]: Warning message'
    )
  })

  test('`error` logs with red message and error context', () => {
    const logger = new Logger('test')
    logger.error('Error message')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'red([packpub][plugin][test][error]: Error message)'
    )
    expect(chalk.red).toHaveBeenCalledWith(
      '[packpub][plugin][test][error]: Error message'
    )
  })
})
