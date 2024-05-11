import { jest } from '@jest/globals'

jest.unstable_mockModule('child_process', () => ({
  exec: jest.fn()
}))

const child_process = await import('child_process')
const Shell = (await import('./index.js')).default

describe('Shell', () => {
  const command = 'echo "Hello World"'
  const args = ['--version']

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('executes command and logs output', async () => {
    const output = 'Hello World\n'
    const execSpy = jest
      .spyOn(child_process, 'exec')
      .mockImplementation((cmd, callback: any) =>
        callback(null, { stdout: output, stderr: '' })
      )
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})
    const shell = new Shell()
    await shell.exec(command, ...args)

    expect(execSpy).toHaveBeenCalledWith(
      `${command} ${args.join(' ')}`,
      expect.any(Function)
    )
    expect(consoleLogSpy).toHaveBeenCalled()
  })

  test('executes command and logs error', async () => {
    const output = 'Error message'
    const execSpy = jest
      .spyOn(child_process, 'exec')
      .mockImplementation((cmd, callback: any) =>
        callback(null, { stdout: '', stderr: output })
      )
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const shell = new Shell()
    await shell.exec(command, ...args)

    expect(execSpy).toHaveBeenCalledWith(
      `${command} ${args.join(' ')}`,
      expect.any(Function)
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(output)
  })

  test('throws error if command execution fails', async () => {
    const error = new Error('Command failed')
    jest
      .spyOn(child_process, 'exec')
      .mockImplementation((cmd, callback: any) =>
        callback(error, { stdout: '', stderr: '' })
      )
    const shell = new Shell()
    await expect(shell.exec(command)).rejects.toThrow('Command failed')
  })
})
