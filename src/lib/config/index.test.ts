import { jest } from '@jest/globals'
import Config from './index.js'

jest.mock('../logger/index.js')

const Logger = (await import('../logger/index.js')).default

describe('Config', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
  })

  test('loads npm and git plugins', async () => {
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(2)
    expect(config.plugins[0].name).toBe('npm')
    expect(config.plugins[1].name).toBe('git')
  })
})
