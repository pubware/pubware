import { jest } from '@jest/globals'

const Logger = (await import('./core/logger/index.js')).default
const FileSystem = (await import('./core/fs/index.js')).default
const Prompter = (await import('./core/prompter/index.js')).default
const Shell = (await import('./core/shell/index.js')).default
const HTTP = (await import('./core/http/index.js')).default
const Plugin = (await import('./index.js')).default

class TestPlugin extends Plugin {
  constructor(name: string) {
    super(name)
  }
}

describe('Plugin', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'info').mockImplementation(() => {})
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
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

  test('writes to file', async () => {
    const writeSpy = jest
      .spyOn(FileSystem.prototype, 'write')
      .mockResolvedValue()
    const plugin = new TestPlugin('test')
    await plugin.write('./file.txt', 'new content')

    expect(writeSpy).toHaveBeenCalledWith('./file.txt', 'new content')
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

  test('prompts for user confirmation', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'confirm')
      .mockResolvedValue(true)
    const plugin = new TestPlugin('test')
    const response = await plugin.promptConfirm('foo?')

    expect(promptSpy).toHaveBeenCalledWith('foo?')
    expect(response).toBe(true)
  })

  test('prompt returns default if headless', async () => {
    const promptSpy = jest
      .spyOn(Prompter.prototype, 'confirm')
      .mockResolvedValue(true)
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.promptConfirm('foo?', false)

    expect(promptSpy).not.toHaveBeenCalled()
    expect(response).toBe(false)
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

  test('prompt returns default if headless', async () => {
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
    await plugin.exec('rm -rf', { write: true })

    expect(execSpy).not.toHaveBeenCalled()
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
})
