import chalk from 'chalk'
import { confirm, input } from '@inquirer/prompts'
import FileSystem from '../core/fs/index.js'
import Shell from '../core/shell/index.js'
import HTTP from '../core/http/index.js'

abstract class Plugin {
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  log(message: string) {
    console.log(chalk.green(message))
  }

  logWarning(message: string) {
    console.warn(chalk.yellow(message))
  }

  logError(message: string) {
    console.error(chalk.red(message))
  }

  async prompt(message: string): Promise<string> {
    return await input({ message })
  }

  async promptConfirm(message: string): Promise<boolean> {
    return await confirm({ message })
  }

  async read(path: string): Promise<string> {
    try {
      return await FileSystem.read(path)
    } catch (err) {
      // TODO Handle errors
      console.error(err)
      throw err
    }
  }

  async write(path: string, data: string): Promise<void> {
    try {
      await FileSystem.write(path, data)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    try {
      await Shell.exec(cmd, ...args)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      return await HTTP.fetch(url, options)
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default Plugin
