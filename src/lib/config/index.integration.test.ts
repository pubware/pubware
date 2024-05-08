import { jest } from '@jest/globals'
import Config from './index.js'

jest.mock('../logger/index.js')

const Logger = (await import('../logger/index.js')).default

describe('Config', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('loads npm and git plugins', async () => {
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(2)
    expect(config.plugins[0].constructor.name).toBe('NPM')
    expect(config.plugins[1].constructor.name).toBe('Git')
  })
})
