import Logger from './index.js'

jest.mock('chalk', () => ({
  black: jest.fn(text => `black(${text})`)
}))

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('logs message to console', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    const logger = new Logger('test')
    logger.log('Hello, world!')

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'black([packpub][test]: Hello, world!)'
    )
  })
})
