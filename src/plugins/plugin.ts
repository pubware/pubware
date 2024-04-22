import { Choices } from '../core/shell/prompter/index.js'
import PluginError from './lib/error.js'
import Shell from '../core/shell/index.js'
import FileSystem from '../core/fs/index.js'
import HTTP from '../core/http/index.js'

abstract class Plugin {
  private _name: string
  private shell: Shell
  private fs: FileSystem
  private http: HTTP

  constructor(name: string) {
    this._name = name
    this.shell = new Shell(name)
    this.fs = new FileSystem()
    this.http = new HTTP()
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  private throwError(message: string, error: Error): never {
    this.shell.logger.logError(message)
    throw new PluginError(this.name, message, error)
  }

  log(message: string) {
    this.shell.logger.log(message)
  }

  async prompt(message: string): Promise<string> {
    this.shell.logger.logInfo('Prompting user')

    try {
      return await this.shell.prompter.input(message)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptConfirm(message: string): Promise<boolean> {
    this.shell.logger.logInfo('Prompting user')

    try {
      return await this.shell.prompter.confirm(message)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptSelect(message: string, choices: Choices): Promise<string> {
    this.shell.logger.logInfo('Prompting user')

    try {
      return await this.shell.prompter.select(message, choices)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async read(path: string): Promise<string> {
    this.shell.logger.logInfo(`Reading file: ${path}`)

    try {
      return await this.fs.read(path)
    } catch (err) {
      this.throwError('Failed to read file', err as Error)
    }
  }

  async write(path: string, data: string): Promise<void> {
    this.shell.logger.logInfo(`Writing to file: ${path}`)

    try {
      await this.fs.write(path, data)
    } catch (err) {
      this.throwError('Failed to write to file', err as Error)
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    this.shell.logger.logInfo('Execing command')

    try {
      await this.shell.exec(cmd, ...args)
    } catch (err) {
      this.throwError('Failed to exec shell command', err as Error)
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    this.shell.logger.logInfo('Fetching resource')

    try {
      return await this.http.fetch(url, options)
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
