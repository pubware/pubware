import { jest } from '@jest/globals'
import Git from './git.js'

describe('Git', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('`postPublish` commits and pushes tag', async () => {
    const git = new Git({})
    jest.spyOn(git, 'promptConfirm').mockResolvedValue(true)
    jest
      .spyOn(git, 'read')
      .mockResolvedValue(JSON.stringify({ version: '4.4.4' }))
    const execSpy = jest.spyOn(git, 'exec').mockResolvedValue()
    await git.postPublish()

    expect(execSpy).toHaveBeenCalledWith('git commit -m "4.4.4"')
    expect(execSpy).toHaveBeenCalledWith('git push origin')
    expect(execSpy).toHaveBeenCalledWith("git tag '-a' v4.4.4 '-m' v4.4.4")
    expect(execSpy).toHaveBeenCalledWith('git push origin v4.4.4')
  })

  test('supports prompt for commit message', async () => {
    const git = new Git({
      commitVersion: false
    })
    jest.spyOn(git, 'promptConfirm').mockResolvedValue(true)
    jest.spyOn(git, 'prompt').mockResolvedValue('A commit message')
    const execSpy = jest.spyOn(git, 'exec').mockResolvedValue()
    await git.postPublish()

    expect(execSpy).toHaveBeenCalledWith('git commit -m "A commit message"')
  })

  test('supports custom remote branch', async () => {
    const git = new Git({
      remote: 'custom'
    })
    jest.spyOn(git, 'promptConfirm').mockResolvedValue(true)
    jest
      .spyOn(git, 'read')
      .mockResolvedValue(JSON.stringify({ version: '5.5.5' }))
    const execSpy = jest.spyOn(git, 'exec').mockResolvedValue()
    await git.postPublish()

    expect(execSpy).toHaveBeenCalledWith('git commit -m "5.5.5"')
    expect(execSpy).toHaveBeenCalledWith('git push custom')
  })
})
