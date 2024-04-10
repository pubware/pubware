import chalk from 'chalk'
import { confirm, input } from '@inquirer/prompts'
import FileSystem from '../core/fs/index.js'
import HTTP from '../core/http/index.js'
import Shell from '../core/shell/index.js'

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

  log(message: string) {
    console.log(chalk.green(message))
  }

  warn(message: string) {
    console.log(chalk.yellow(message))
  }

  async promptInput(message: string): Promise<string> {
    return await input({ message })
  }

  async promptConfirm(message: string): Promise<boolean> {
    return await confirm({ message })
  }

  async read(path: string): Promise<string> {
    return await FileSystem.read(path)
  }

  async write(path: string, data: string): Promise<void> {
    await FileSystem.write(path, data)
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    try {
      await Shell.exec(cmd, ...args)
    } catch (err) {
      console.error(err)
    }
  }

  async request<T>(url: string, options?: RequestInit): Promise<T> {
    return await HTTP.request(url, options)
  }
}

export default Plugin
