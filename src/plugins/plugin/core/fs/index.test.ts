import { jest } from '@jest/globals'

jest.unstable_mockModule('node:fs/promises', () => ({
  default: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}))

const fs = (await import('node:fs/promises')).default
const FileSystem = (await import('./index.js')).default

describe('FileSystem', () => {
  const file = './file.txt'
  const content = 'Hello, world!'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('reads file content', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(content)
    const fileSystem = new FileSystem()
    const data = await fileSystem.read(file)

    expect(data).toBe(content)
    expect(fs.readFile).toHaveBeenCalledWith(file, { encoding: 'utf8' })
  })

  test('throws error when reading a file that does not exist', async () => {
    jest.mocked(fs.readFile).mockRejectedValue(new Error('Failed to read file'))
    const fileSystem = new FileSystem()
    await expect(fileSystem.read('error.txt')).rejects.toThrow(
      'Failed to read file'
    )
  })

  test('writes content to file', async () => {
    jest.mocked(fs.writeFile).mockResolvedValue()
    const content = 'Hello, world!'
    const fileSystem = new FileSystem()
    await fileSystem.write(file, content)

    expect(fs.writeFile).toHaveBeenCalledWith(file, content, {
      encoding: 'utf8'
    })
  })

  test('throws error when writing to a file that does not exist', async () => {
    jest
      .mocked(fs.writeFile)
      .mockRejectedValue(new Error('Failed to write to file'))
    const fileSystem = new FileSystem()
    await expect(fileSystem.write('error.txt', content)).rejects.toThrow(
      'Failed to write to file'
    )
  })
})
