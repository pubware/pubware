import chalk from 'chalk'
import { confirm, input, select, Separator } from '@inquirer/prompts'
import PluginError from './error.js'
import FileSystem from '../core/fs/index.js'
import Shell from '../core/shell/index.js'
import HTTP from '../core/http/index.js'

export interface Choice {
  name?: string
  value: string
  description?: string
}

abstract class Plugin {
  private _name: string

  constructor(name: string) {
    this._name = name

    this.log('Initialized')
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  output(message: string) {
    console.log(`[packpub][plugin][${this.name}]: ${message}`)
  }

  private log(message: string) {
    console.log(chalk.blue(`[packpub][plugin][${this.name}]: ${message}`))
  }

  private logError(message: string) {
    console.error(
      chalk.red(`[packpub][plugin][${this.name}][error]: ${message}`)
    )
  }

  throwError(message: string, error: Error): never {
    this.logError(message)
    throw new PluginError(this.name, message, error)
  }

  async prompt(message: string): Promise<string> {
    try {
      return await input({ message })
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptConfirm(message: string): Promise<boolean> {
    try {
      return await confirm({ message })
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptSelect(
    message: string,
    choices: (Choice | Separator)[]
  ): Promise<string> {
    try {
      return await select({ message, choices })
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async read(path: string): Promise<string> {
    this.log(`Reading file: ${path}`)

    try {
      return await FileSystem.read(path)
    } catch (err) {
      this.throwError('Failed to read file', err as Error)
    }
  }

  async write(path: string, data: string): Promise<void> {
    this.log(`Writing to file: ${path}`)

    try {
      await FileSystem.write(path, data)
    } catch (err) {
      this.throwError('Failed to write to file', err as Error)
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    this.log('Execing command')

    try {
      await Shell.exec(cmd, ...args)
    } catch (err) {
      this.throwError('Failed to exec shell command', err as Error)
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    this.log('Fetching resource')

    try {
      return await HTTP.fetch(url, options)
    } catch (err) {
      this.throwError('Failed to fetch resource', err as Error)
    }
  }

  init?(): void
  beforeBump?(): void
  bump?(): void
  beforePublish?(): void
  publish?(): void
  postPublish?(): void
}

export default Plugin
