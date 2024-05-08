import { jest } from '@jest/globals'
import CLI from './index.js'

jest.mock('../logger/index.js')
jest.mock('../config/index.js')
jest.mock('../lifecycle/index.js')

const Logger = (await import('../logger/index.js')).default
const Config = (await import('../config/index.js')).default
const Lifecycle = (await import('../lifecycle/index.js')).default

describe('CLI', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
    jest.spyOn(Lifecycle.prototype, 'run').mockResolvedValue()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('initializes config with flags', async () => {
    const initSpy = jest.spyOn(Config.prototype, 'init')
    const cli = new CLI()
    await cli.run(['node', '../bin/packpub.js', '--dry-run', '--headless'])

    expect(initSpy).toHaveBeenCalledWith({ dryRun: true, headless: true })
  })

  test('attaches events to lifecycle', async () => {
    const lifecycleListenerSpy = jest.spyOn(Lifecycle.prototype, 'on')
    const cli = new CLI()
    await cli.run(['node', '../bin/packpub.js'])

    expect(lifecycleListenerSpy).toHaveBeenCalled()
  })

  test('runs lifecycle', async () => {
    const lifecycleSpy = jest
      .spyOn(Lifecycle.prototype, 'run')
      .mockResolvedValue()
    const cli = new CLI()
    await cli.run(['node', '../bin/packpub.js'])

    expect(lifecycleSpy).toHaveBeenCalled()
  })
})
