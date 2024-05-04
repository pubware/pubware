import {
  logBase,
  logInfo,
  fsRead,
  fsWrite,
  promptInput,
  promptConfirm,
  promptSelect,
  shExec,
  httpFetch
} from './__mocks__/mocks.js'
import Plugin from './index.js'

class TestPlugin extends Plugin {
  constructor(name: string) {
    super(name)
  }
}

describe('Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('logs message', async () => {
    const plugin = new TestPlugin('test')
    await plugin.log('message')
    expect(logBase).toHaveBeenCalledWith('message')
  })

  test('reads file', async () => {
    fsRead.mockResolvedValue('file content')
    const plugin = new TestPlugin('test')
    const data = await plugin.read('./file.txt')

    expect(logInfo).toHaveBeenCalledWith('Reading file: ./file.txt')
    expect(fsRead).toHaveBeenCalledWith('./file.txt')
    expect(data).toBe('file content')
  })

  test('writes to file', async () => {
    const plugin = new TestPlugin('test')
    await plugin.write('./file.txt', 'new content')

    expect(logInfo).toHaveBeenCalledWith('Writing to file: ./file.txt')
    expect(fsWrite).toHaveBeenCalledWith('./file.txt', 'new content')
  })

  test('prompts for user input', async () => {
    promptInput.mockResolvedValue('bar')
    const plugin = new TestPlugin('test')
    const response = await plugin.prompt('foo?')

    expect(logInfo).toHaveBeenCalledWith('Prompting user')
    expect(promptInput).toHaveBeenCalledWith('foo?')
    expect(response).toBe('bar')
  })

  test('prompt returns default if headless', async () => {
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.prompt('foo?', 'default')

    expect(logInfo).toHaveBeenCalledWith('Prompting user')
    expect(promptInput).not.toHaveBeenCalled()
    expect(response).toBe('default')
  })

  test('prompts for user confirmation', async () => {
    promptConfirm.mockResolvedValue(true)
    const plugin = new TestPlugin('test')
    const response = await plugin.promptConfirm('foo?')

    expect(logInfo).toHaveBeenCalledWith('Prompting user confirmation')
    expect(promptConfirm).toHaveBeenCalledWith('foo?')
    expect(response).toBe(true)
  })

  test('prompt returns default if headless', async () => {
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.promptConfirm('foo?', false)

    expect(logInfo).toHaveBeenCalledWith('Prompting user confirmation')
    expect(promptConfirm).not.toHaveBeenCalled()
    expect(response).toBe(false)
  })

  test('prompts for user selection', async () => {
    promptSelect.mockResolvedValue('bar')
    const plugin = new TestPlugin('test')
    const response = await plugin.promptSelect('foo?', [
      { value: 'foo' },
      { value: 'bar' }
    ])

    expect(logInfo).toHaveBeenCalledWith('Prompting user selection')
    expect(promptSelect).toHaveBeenCalledWith('foo?', [
      { value: 'foo' },
      { value: 'bar' }
    ])
    expect(response).toBe('bar')
  })

  test('prompt returns default if headless', async () => {
    const plugin = new TestPlugin('test')
    plugin.flags.headless = true
    const response = await plugin.promptSelect(
      'foo?',
      [{ value: 'foo' }, { value: 'bar' }],
      'foo'
    )

    expect(logInfo).toHaveBeenCalledWith('Prompting user selection')
    expect(promptSelect).not.toHaveBeenCalled()
    expect(response).toBe('foo')
  })

  test('execs command', async () => {
    shExec.mockResolvedValue('Hello World')
    const plugin = new TestPlugin('test')
    await plugin.exec('echo "Hello World"')

    expect(logInfo).toHaveBeenCalledWith('Execing command: echo "Hello World"')
    expect(shExec).toHaveBeenCalledWith('echo "Hello World"')
  })

  test('execs command if dry and readable', async () => {
    shExec.mockResolvedValue('Hello World')
    const plugin = new TestPlugin('test')
    plugin.flags.dry = true
    await plugin.exec('echo "Hello World"', { write: false })

    expect(logInfo).toHaveBeenCalledWith('Execing command: echo "Hello World"')
    expect(shExec).toHaveBeenCalledWith('echo "Hello World"')
  })

  test('exec aborts command if dry and writable', async () => {
    const plugin = new TestPlugin('test')
    plugin.flags.dry = true
    await plugin.exec('rm -rf', { write: true })

    expect(logInfo).toHaveBeenCalledWith('Execing command: rm -rf')
    expect(logInfo).toHaveBeenCalledWith(
      'Aborting write-based command during dry run'
    )
    expect(shExec).not.toHaveBeenCalled()
  })

  test('fetches network resource', async () => {
    httpFetch.mockResolvedValue({ message: 'Hello World' })
    const plugin = new TestPlugin('test')
    const response = await plugin.fetch('http://example.com')

    expect(logInfo).toHaveBeenCalledWith(
      'Fetching resource: http://example.com'
    )
    expect(httpFetch).toHaveBeenCalledWith('http://example.com', {})
    expect(response).toEqual({ message: 'Hello World' })
  })
})
