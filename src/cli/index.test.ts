import { jest } from '@jest/globals'
import Lifecycle from '../lib/lifecycle/index.js'
import CLI from './index.js'

describe('CLI', () => {
  beforeAll(() => {
    jest.spyOn(Lifecycle.prototype, 'run').mockResolvedValue()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('attaches events to lifecycle', async () => {
    const lifecycleListenerSpy = jest.spyOn(Lifecycle.prototype, 'on')
    const cli = new CLI()
    await cli.run(['node', '../bin/pubware.js'])

    expect(lifecycleListenerSpy).toHaveBeenCalledWith(
      'preBump',
      expect.any(Function)
    )
    expect(lifecycleListenerSpy).toHaveBeenCalledWith(
      'bump',
      expect.any(Function)
    )
    expect(lifecycleListenerSpy).toHaveBeenCalledWith(
      'prePublish',
      expect.any(Function)
    )
    expect(lifecycleListenerSpy).toHaveBeenCalledWith(
      'publish',
      expect.any(Function)
    )
    expect(lifecycleListenerSpy).toHaveBeenCalledWith(
      'postPublish',
      expect.any(Function)
    )
  })

  test('runs lifecycle', async () => {
    const lifecycleSpy = jest
      .spyOn(Lifecycle.prototype, 'run')
      .mockResolvedValue()
    const cli = new CLI()
    await cli.run(['node', '../bin/pubware.js'])

    expect(lifecycleSpy).toHaveBeenCalled()
  })
})
