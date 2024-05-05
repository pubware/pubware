import { exec as nodeExec } from 'child_process'
import Shell from './index.js'

jest.mock('child_process')

describe('Shell', () => {
  const command = 'echo "Hello World"'
  const args = ['--version']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('executes command and logs output', async () => {
    const output = 'Hello World\n'
    jest
      .mocked(nodeExec)
      .mockImplementation((cmd, callback: any) =>
        callback(null, { stdout: output, stderr: '' })
      )

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    const shell = new Shell()
    await shell.exec(command, ...args)

    expect(nodeExec).toHaveBeenCalledWith(
      `${command} ${args.join(' ')}`,
      expect.any(Function)
    )
    expect(consoleLogSpy).toHaveBeenCalledWith(output)
  })

  test('handles stderr by logging error', async () => {
    const output = 'Error message'
    jest
      .mocked(nodeExec)
      .mockImplementation((cmd, callback: any) =>
        callback(null, { stdout: '', stderr: output })
      )

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const shell = new Shell()
    await shell.exec(command)

    expect(consoleErrorSpy).toHaveBeenCalledWith(output)
  })

  test('throws error if command execution fails', async () => {
    expect(async () => {
      const error = new Error('Command failed')
      jest
        .mocked(nodeExec)
        .mockImplementation((cmd, callback: any) =>
          callback(error, { stdout: '', stderr: '' })
        )

      const shell = new Shell()
      await shell.exec(command)
    }).rejects.toThrow('Command failed')
  })
})
