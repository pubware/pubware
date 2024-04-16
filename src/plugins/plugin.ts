import chalk from 'chalk'
import { confirm, input, select, Separator } from '@inquirer/prompts'
import FileSystem from '../core/fs/index.js'
import Shell from '../core/shell/index.js'
import HTTP from '../core/http/index.js'

interface Choice {
  name?: string
  value: string
  description?: string
}

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
    console.log(chalk.blue(`🔵 [plugin][${this.name}]: ${message}`))
  }

  logSuccess(message: string) {
    console.log(chalk.green(`🟢 [plugin][${this.name}]: ${message}`))
  }

  logWarning(message: string) {
    console.log(chalk.yellow(`🟡 [plugin][${this.name}]: ${message}`))
  }

  logError(message: string) {
    console.log(chalk.red(`🔴 [plugin][${this.name}]: ${message}`))
  }

  async prompt(message: string): Promise<string> {
    return await input({ message })
  }

  async promptConfirm(message: string): Promise<boolean> {
    return await confirm({ message })
  }

  async promptSelect(
    message: string,
    choices: (Choice | Separator)[]
  ): Promise<string> {
    return await select({ message, choices })
  }

  async read(path: string): Promise<string> {
    try {
      return await FileSystem.read(path)
    } catch (err) {
      throw err
    }
  }

  async write(path: string, data: string): Promise<void> {
    try {
      await FileSystem.write(path, data)
    } catch (err) {
      throw err
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    try {
      await Shell.exec(cmd, ...args)
    } catch (err) {
      throw err
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      return await HTTP.fetch(url, options)
    } catch (err) {
      throw err
    }
  }
}

export default Plugin
