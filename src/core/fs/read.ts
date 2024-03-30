import fs from 'node:fs/promises'

interface Options {
  encoding: BufferEncoding
}

const optsDefault: Options = {
  encoding: 'utf8'
}

export async function fsRead(
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
