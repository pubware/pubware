import { jest } from '@jest/globals'
import NPM from './npm.js'

describe('NPM', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('`preBump` runs npm build cmd and logs version', async () => {
    const npm = new NPM({})
    jest
      .spyOn(npm, 'read')
      .mockResolvedValue(JSON.stringify({ version: '9.9.9' }))
    const execSpy = jest.spyOn(npm, 'exec').mockResolvedValue()
    const logSpy = jest.spyOn(npm, 'log').mockImplementation(() => {})
    await npm.preBump()

    expect(execSpy).toHaveBeenCalledWith('npm run build')
    expect(logSpy).toHaveBeenCalledWith('Package version: 9.9.9')
  })

  test('`bump` runs npm version cmd', async () => {
    const npm = new NPM({})
    jest.spyOn(npm, 'promptSelect').mockResolvedValue('patch')
    const execSpy = jest.spyOn(npm, 'exec').mockResolvedValue()
    await npm.bump()

    expect(execSpy).toHaveBeenCalledWith(
      'npm version patch  --git-tag-version=false'
    )
  })

  test('`prePublish` logs version', async () => {
    const npm = new NPM({})
    jest
      .spyOn(npm, 'read')
      .mockResolvedValue(JSON.stringify({ version: '1.1.1' }))
    const logSpy = jest.spyOn(npm, 'log').mockImplementation(() => {})
    await npm.prePublish()

    expect(logSpy).toHaveBeenCalledWith('Package version: 1.1.1')
  })

  test('`publish` runs npm publish cmd', async () => {
    const npm = new NPM({})
    const execSpy = jest.spyOn(npm, 'exec').mockResolvedValue()
    await npm.publish()

    expect(execSpy).toHaveBeenCalledWith('npm publish ')
  })
})
