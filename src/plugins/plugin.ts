import { fsRead } from '../core/fs/read.js'
import { fsWrite } from '../core/fs/write.js'
import { shExec } from '../core/shell/exec.js'
import { httpRequest } from '../core/http/request.js'

class Plugin {
  private _name: string
  private _disabled: boolean

  constructor(name: string) {
    this._name = name
    this._disabled = false
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  get disabled(): boolean {
    return this._disabled
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled
  }

  async read(path: string): Promise<string> {
    return await fsRead(path)
  }

  async write(path: string, data: string) {
    await fsWrite(path, data)
  }

  async exec(cmd: string) {
    try {
      await shExec(cmd)
    } catch (err) {
      console.error(err)
    }
  }

  async request<T>(url: string): Promise<T | undefined> {
    return await httpRequest(url)
  }
}

export default Plugin
