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
): Promise<void> {
  try {
    const data = await fs.readFile(path, opts)
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}
