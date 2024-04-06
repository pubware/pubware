import fs from 'node:fs/promises'

interface Options {
  encoding: BufferEncoding
}

const optsDefault: Options = {
  encoding: 'utf8'
}

class FileSystem {
  static async read(
    path: string,
    opts: Options = optsDefault
  ): Promise<string> {
    try {
      return await fs.readFile(path, opts)
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  static async write(path: string, content: string): Promise<void> {
    try {
      await fs.writeFile(path, content)
    } catch (err) {
      console.error(err)
    }
  }
}

export default FileSystem
