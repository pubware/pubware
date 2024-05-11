import { jest } from '@jest/globals'

jest.unstable_mockModule('node:fs/promises', () => ({
  default: {
    readFile: jest.fn()
  }
}))

jest.unstable_mockModule('../logger/index.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }))
}))

const fs = (await import('node:fs/promises')).default
const Config = (await import('./index.js')).default

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('loads npm and git plugins', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify({}))
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(2)
    expect(config.plugins[0].constructor.name).toBe('NPM')
    expect(config.plugins[1].constructor.name).toBe('Git')
  })

  test('disables internal npm plugin', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        packpub: {
          plugins: {
            internal: {
              npm: {
                disabled: true
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(1)
    expect(config.plugins[0].constructor.name).toBe('Git')
  })

  test('disables internal git plugin', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        packpub: {
          plugins: {
            internal: {
              git: {
                disabled: true
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(1)
    expect(config.plugins[0].constructor.name).toBe('NPM')
  })

  test('disables both internal plugins', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        packpub: {
          plugins: {
            internal: {
              npm: {
                disabled: true
              },
              git: {
                disabled: true
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({})

    expect(config.plugins.length).toBe(0)
  })
})
