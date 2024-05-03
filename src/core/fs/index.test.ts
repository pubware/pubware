import fs from 'node:fs/promises'
import FileSystem from './index.js'

jest.mock('node:fs/promises')

describe('FileSystem', () => {
  const file = './file.txt'
  const content = 'Hello, world!'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('reads file content', async () => {
    jest.mocked(fs.readFile).mockResolvedValue(content)

    const fileSystem = new FileSystem()
    const data = await fileSystem.read(file)

    expect(data).toBe(content)
    expect(fs.readFile).toHaveBeenCalledWith(file, { encoding: 'utf8' })
  })

  test('throws error when reading a file that does not exist', async () => {
    expect(async () => {
      jest
        .mocked(fs.readFile)
        .mockRejectedValue(new Error('Failed to read file'))

      const fileSystem = new FileSystem()
      await fileSystem.read('error.txt')
    }).rejects.toThrow('Failed to read file')
  })

  test('writes content to file', async () => {
    const content = 'Hello, world!'
    const fileSystem = new FileSystem()
    await fileSystem.write(file, content)

    expect(fs.writeFile).toHaveBeenCalledWith(file, content, {
      encoding: 'utf8'
    })
  })

  test('throws error when writing to a file that does not exist', () => {
    expect(async () => {
      jest
        .mocked(fs.writeFile)
        .mockRejectedValue(new Error('Failed to write to file'))

      const fileSystem = new FileSystem()
      await fileSystem.write('error.txt', content)
    }).rejects.toThrow('Failed to write to file')
  })
})
