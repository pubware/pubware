import { jest } from '@jest/globals'

jest.unstable_mockModule('../logger/index.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }))
}))

const Config = (await import('./index.js')).default

describe('Config', () => {
  test('loads npm and git plugins', async () => {
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(2)
    expect(config.plugins[0].constructor.name).toBe('NPM')
    expect(config.plugins[1].constructor.name).toBe('Git')
  })
})
