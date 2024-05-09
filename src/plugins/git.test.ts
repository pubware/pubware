import { jest } from '@jest/globals'
import Git from './git.js'

describe('Git', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('post-publish commits tag and pushes to remote', async () => {
    const git = new Git({})
    jest.spyOn(git, 'promptConfirm').mockResolvedValue(true)
    jest
      .spyOn(git, 'read')
      .mockResolvedValue(JSON.stringify({ version: '4.4.4' }))
    jest.spyOn(git, 'log').mockImplementation(() => {})
    const execSpy = jest.spyOn(git, 'exec').mockResolvedValue()
    await git.postPublish()

    expect(execSpy).toHaveBeenCalledWith('git commit -m "4.4.4"')
    expect(execSpy).toHaveBeenCalledWith('git push origin')
    expect(execSpy).toHaveBeenCalledWith("git tag '-a' v4.4.4 '-m' v4.4.4")
    expect(execSpy).toHaveBeenCalledWith('git push origin v4.4.4')
  })
})
