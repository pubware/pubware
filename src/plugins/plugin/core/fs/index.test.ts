import { jest } from '@jest/globals'

jest.mock('node:fs/promises')

const fs = (await import('node:fs/promises')).default
const FileSystem = (await import('./index.js')).default

describe('FileSystem', () => {
  const file = './file.txt'
  const content = 'Hello, world!'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('reads file content', async () => {
    const readSpy = jest.spyOn(fs, 'readFile').mockResolvedValue(content)
    const fileSystem = new FileSystem()
    const data = await fileSystem.read(file)

    expect(data).toBe(content)
    expect(readSpy).toHaveBeenCalledWith(file, { encoding: 'utf8' })
  })

  test('throws error when reading a file that does not exist', async () => {
    expect(async () => {
      jest
        .spyOn(fs, 'readFile')
        .mockRejectedValue(new Error('Failed to read file'))
      const fileSystem = new FileSystem()
      await fileSystem.read('error.txt')
    }).rejects.toThrow('Failed to read file')
  })

  test('writes content to file', async () => {
    const writeSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue()
    const content = 'Hello, world!'
    const fileSystem = new FileSystem()
    await fileSystem.write(file, content)

    expect(writeSpy).toHaveBeenCalledWith(file, content, {
      encoding: 'utf8'
    })
  })

  test('throws error when writing to a file that does not exist', () => {
    expect(async () => {
      jest
        .spyOn(fs, 'writeFile')
        .mockRejectedValue(new Error('Failed to write to file'))
      const fileSystem = new FileSystem()
      await fileSystem.write('error.txt', content)
    }).rejects.toThrow('Failed to write to file')
  })
})
