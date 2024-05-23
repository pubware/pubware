import { jest } from '@jest/globals'

jest.unstable_mockModule('node:fs/promises', () => ({
  default: {
    readFile: jest.fn()
  }
}))

const fs = (await import('node:fs/promises')).default
const Config = (await import('./index.js')).default

describe('Config', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('loads npm and git plugins', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify({}))
    const config = new Config()
    await config.init({ dryRun: false, headless: false })

    expect(config.plugins.length).toBe(2)
    expect(config.plugins[0].name).toBe('npm')
    expect(config.plugins[1].name).toBe('git')
  })

  test('disables internal npm plugin', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        pubware: {
          plugins: {
            internal: {
              '@pubware/npm': {
                disabled: true
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({ dryRun: false, headless: false })

    expect(config.plugins.length).toBe(1)
    expect(config.plugins[0].name).toBe('git')
  })

  test('disables internal git plugin', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        pubware: {
          plugins: {
            internal: {
              '@pubware/git': {
                disabled: true
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({ dryRun: false, headless: false })

    expect(config.plugins.length).toBe(1)
    expect(config.plugins[0].name).toBe('npm')
  })

  test('disables both internal plugins', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        pubware: {
          plugins: {
            internal: {
              '@pubware/npm': {
                disabled: true
              },
              '@pubware/git': {
                disabled: true
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({ dryRun: false, headless: false })

    expect(config.plugins.length).toBe(0)
  })

  test('loads external plugin', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        pubware: {
          plugins: {
            internal: {
              '@pubware/npm': {
                disabled: true
              }
            },
            external: {
              '@pubware/npm': {}
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({ dryRun: false, headless: false })

    expect(config.plugins.length).toBe(2)
    expect(config.plugins[0].name).toBe('git')
    expect(config.plugins[1].name).toBe('npm')
  })

  test('maps configs to plugins', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        pubware: {
          plugins: {
            internal: {
              '@pubware/npm': {
                preReleaseId: 'alpha'
              }
            }
          }
        }
      })
    )
    const config = new Config()
    await config.init({ dryRun: false, headless: false })

    expect(config.plugins[0].config.preReleaseId).toBe('alpha')
  })

  test('maps flags to plugins', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify({}))
    const config = new Config()
    await config.init({ dryRun: true, headless: true })

    for (const plugin of config.plugins) {
      for (const flag of Object.values(plugin.flags)) {
        expect(flag).toBe(true)
      }
    }
  })
})
