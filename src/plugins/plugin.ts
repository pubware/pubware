import Logger from './lib/logger.js'
import Prompter, { Choices } from './lib/prompter.js'
import PluginError from './lib/error.js'
import FileSystem from '../core/fs/index.js'
import Shell from '../core/shell/index.js'
import HTTP from '../core/http/index.js'

abstract class Plugin {
  private _name: string
  private logger: Logger
  protected prompter: Prompter

  constructor(name: string) {
    this._name = name
    this.logger = new Logger(name)
    this.prompter = new Prompter()
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  private throwError(message: string, error: Error): never {
    this.logger.logError(message)
    throw new PluginError(this.name, message, error)
  }

  log(message: string) {
    this.logger.log(message)
  }

  async prompt(message: string): Promise<string> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.prompter.input(message)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptConfirm(message: string): Promise<boolean> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.prompter.confirm(message)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptSelect(message: string, choices: Choices): Promise<string> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.prompter.select(message, choices)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async read(path: string): Promise<string> {
    this.logger.logInfo(`Reading file: ${path}`)

    try {
      return await FileSystem.read(path)
    } catch (err) {
      this.throwError('Failed to read file', err as Error)
    }
  }

  async write(path: string, data: string): Promise<void> {
    this.logger.logInfo(`Writing to file: ${path}`)

    try {
      await FileSystem.write(path, data)
    } catch (err) {
      this.throwError('Failed to write to file', err as Error)
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    this.logger.logInfo('Execing command')

    try {
      await Shell.exec(cmd, ...args)
    } catch (err) {
      this.throwError('Failed to exec shell command', err as Error)
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    this.logger.logInfo('Fetching resource')

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
