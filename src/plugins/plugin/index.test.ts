import { jest } from '@jest/globals'
import Logger from './core/logger/index.js'
import FileSystem from './core/fs/index.js'
import Prompter from './core/prompter/index.js'
import Shell from './core/shell/index.js'
import HTTP from './core/http/index.js'
import Plugin from './index.js'

class TestPlugin extends Plugin {
  constructor(name: string) {
    super(name)
  }
}

describe('Plugin', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('inits with `false` dry and headless flags', async () => {
    const plugin = new TestPlugin('test')
    expect(plugin.flags.dry).toBe(false)
    expect(plugin.flags.headless).toBe(false)
  })

  test('sets dry and headless flags', async () => {
    const plugin = new TestPlugin('test')
    plugin.flags.dry = true
    plugin.flags.headless = true
    expect(plugin.flags.dry).toBe(true)
    expect(plugin.flags.headless).toBe(true)
  })

  test('logs message', async () => {
    const logSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {})
    const plugin = new TestPlugin('test')
    await plugin.log('message')

    expect(logSpy).toHaveBeenCalledWith('message')
  })

  test('reads file', async () => {
    const readSpy = jest
      .spyOn(FileSystem.prototype, 'read')
      .mockResolvedValue('file content')
    const plugin = new TestPlugin('test')
    const data = await plugin.read('./file.txt')

    expect(readSpy).toHaveBeenCalledWith('./file.txt')
    expect(data).toBe('file content')
  })

  test('re-throws error when read fails', async () => {
    jest
      .spyOn(FileSystem.prototype, 'read')
      .mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(plugin.read('./file.txt')).rejects.toThrow('test')
  })

  test('writes to file', async () => {
    const writeSpy = jest
      .spyOn(FileSystem.prototype, 'write')
      .mockResolvedValue()
    const plugin = new TestPlugin('test')
    await plugin.write('./file.txt', 'new content')

    expect(writeSpy).toHaveBeenCalledWith('./file.txt', 'new content')
  })

  test('re-throws error when write fails', async () => {
    jest
      .spyOn(FileSystem.prototype, 'write')
      .mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(plugin.write('./file.txt', 'new content')).rejects.toThrow(
      'test'
    )
  })

  test('prompts for user input', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'input')
      .mockResolvedValue('bar')
    const plugin = new TestPlugin('test')
    const response = await plugin.prompt('foo?')

    expect(promptSpy).toHaveBeenCalledWith('foo?')
    expect(response).toBe('bar')
  })

  test('prompt returns default if headless', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'input')
      .mockResolvedValue('bar')
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.prompt('foo?', 'default')

    expect(promptSpy).not.toHaveBeenCalled()
    expect(response).toBe('default')
  })

  test('re-throws error when prompt fails', async () => {
    jest.spyOn(Prompter.prototype, 'input').mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(plugin.prompt('foo?')).rejects.toThrow('test')
  })

  test('prompts for user confirmation', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'confirm')
      .mockResolvedValue(true)
    const plugin = new TestPlugin('test')
    const response = await plugin.promptConfirm('foo?')

    expect(promptSpy).toHaveBeenCalledWith('foo?')
    expect(response).toBe(true)
  })

  test('prompt confirm returns default if headless', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'confirm')
      .mockResolvedValue(true)
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.promptConfirm('foo?', false)

    expect(promptSpy).not.toHaveBeenCalled()
    expect(response).toBe(false)
  })

  test('re-throws error when prompt confirm fails', async () => {
    jest
      .spyOn(Prompter.prototype, 'confirm')
      .mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(plugin.promptConfirm('foo?')).rejects.toThrow('test')
  })

  test('prompts for user selection', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'select')
      .mockResolvedValue('bar')
    const plugin = new TestPlugin('test')
    const response = await plugin.promptSelect('foo?', [
      { value: 'foo' },
      { value: 'bar' }
    ])

    expect(promptSpy).toHaveBeenCalledWith('foo?', [
      { value: 'foo' },
      { value: 'bar' }
    ])
    expect(response).toBe('bar')
  })

  test('prompt select returns default if headless', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'select')
      .mockResolvedValue('bar')
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.promptSelect(
      'foo?',
      [{ value: 'foo' }, { value: 'bar' }],
      'foo'
    )

    expect(promptSpy).not.toHaveBeenCalled()
    expect(response).toBe('foo')
  })

  test('re-throws error when prompt select fails', async () => {
    jest
      .spyOn(Prompter.prototype, 'select')
      .mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(
      plugin.promptSelect('foo?', [{ value: 'foo' }, { value: 'bar' }])
    ).rejects.toThrow('test')
  })

  test('execs command', async () => {
    const execSpy = jest.spyOn(Shell.prototype, 'exec').mockResolvedValue()
    const plugin = new TestPlugin('test')
    await plugin.exec('echo "Hello World"')

    expect(execSpy).toHaveBeenCalledWith('echo "Hello World"')
  })

  test('execs command if dry and readable', async () => {
    const execSpy = jest.spyOn(Shell.prototype, 'exec').mockResolvedValue()
    const plugin = new TestPlugin('test')
    plugin.flags.dry = true
    await plugin.exec('echo "Hello World"', { write: false })

    expect(execSpy).toHaveBeenCalledWith('echo "Hello World"')
  })

  test('aborts command if dry and writable', async () => {
    const execSpy = jest.spyOn(Shell.prototype, 'exec').mockResolvedValue()
    const plugin = new TestPlugin('test')
    plugin.flags.dry = true
    await plugin.exec('echo "Hello World"', { write: true })

    expect(execSpy).not.toHaveBeenCalled()
  })

  test('re-throws error when exec fails', async () => {
    jest.spyOn(Shell.prototype, 'exec').mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(plugin.exec('echo "Hello World"')).rejects.toThrow('test')
  })

  test('fetches resource', async () => {
    const fetchSpy = jest
      .spyOn(HTTP.prototype, 'fetch')
      .mockResolvedValue({ message: 'Hello World' })
    const plugin = new TestPlugin('test')
    const response = await plugin.fetch('http://example.com')

    expect(fetchSpy).toHaveBeenCalledWith('http://example.com', {})
    expect(response).toEqual({ message: 'Hello World' })
  })

  test('re-throws error when fetch fails', async () => {
    jest.spyOn(HTTP.prototype, 'fetch').mockRejectedValue(new Error('test'))
    const plugin = new TestPlugin('test')
    await expect(plugin.fetch('http://example.com')).rejects.toThrow('test')
  })
})
