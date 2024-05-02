import fs from 'node:fs/promises'

interface Options {
  encoding: BufferEncoding
}

const optsDefault: Options = {
  encoding: 'utf8'
}

class FileSystem {
  async read(path: string, opts: Options = optsDefault): Promise<string> {
    try {
      return await fs.readFile(path, opts)
    } catch (err) {
      throw err
    }
  }

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
