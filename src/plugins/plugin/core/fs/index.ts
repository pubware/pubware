import fs from 'node:fs/promises'

interface Options {
  encoding: BufferEncoding
}

const optsDefault: Options = {
  encoding: 'utf8'
}

/**
 * Class responsible for file system operations.
 */
class FileSystem {
  /**
   * Reads the content of a file at a specified path.
   * @param {string} path The path to the file.
   * @param {Options} [opts=optsDefault] The options for reading the file, including encoding.
   * @returns {Promise<string>} A promise that resolves with the content of the file.
   * @throws {Error} Throws an error if the file cannot be read.
   */
  async read(path: string, opts: Options = optsDefault): Promise<string> {
    try {
      return await fs.readFile(path, opts)
    } catch (err) {
      throw err
    }
  }

  /**
   * Writes content to a file at a specified path.
   * @param {string} path The path to the file.
   * @param {string} content The content to write to the file.
   * @param {Options} [opts=optsDefault] The options for writing to the file, including encoding.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully written.
   * @throws {Error} Throws an error if the file cannot be written.
   */
  async write(
    path: string,
    content: string,
    opts: Options = optsDefault
  ): Promise<void> {
    try {
      await fs.writeFile(path, content, opts)
    } catch (err) {
      throw err
    }
  }
}

export default FileSystem
