import fs from 'node:fs/promises'

export async function fsWrite(path: string, content: string): Promise<void> {
  try {
    await fs.writeFile(path, content)
  } catch (err) {
    console.error(err)
  }
}
