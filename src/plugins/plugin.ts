import PluginError from './lib/error.js'
import Logger from '../core/logger/index.js'
import Shell from '../core/shell/index.js'
import { Choices } from '../core/shell/prompter/index.js'
import FileSystem from '../core/fs/index.js'
import HTTP from '../core/http/index.js'

interface Flags {
  dryRun: boolean
  headless: boolean
}

abstract class Plugin {
  private _name: string
  private _flags: Flags
  private logger: Logger
  private shell: Shell
  private fs: FileSystem
  private http: HTTP

  constructor(name: string) {
    this._name = name
    // TODO Update `dryRun` to `false`
    this._flags = {
      dryRun: true,
      headless: false
    }
    this.logger = new Logger(name)
    this.shell = new Shell()
    this.fs = new FileSystem()
    this.http = new HTTP()
  }

  private throwError(message: string, error: Error): never {
    this.logger.logError(message)
    throw new PluginError(this.name, message, error)
  }

  get name(): string {
    return this._name
  }

  get flags(): Flags {
    return this._flags
  }

  set flags(flags: Flags) {
    this._flags = { ...this._flags, ...flags }
  }

  log(message: string) {
    this.logger.log(message)
  }

  async prompt(message: string): Promise<string> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.shell.prompter.input(message)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptConfirm(message: string): Promise<boolean> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.shell.prompter.confirm(message)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async promptSelect(message: string, choices: Choices): Promise<string> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.shell.prompter.select(message, choices)
    } catch (err) {
      this.throwError('Failed to prompt user', err as Error)
    }
  }

  async read(path: string): Promise<string> {
    this.logger.logInfo(`Reading file: ${path}`)

    try {
      return await this.fs.read(path)
    } catch (err) {
      this.throwError('Failed to read file', err as Error)
    }
  }

  async write(path: string, data: string): Promise<void> {
    this.logger.logInfo(`Writing to file: ${path}`)

    try {
      await this.fs.write(path, data)
    } catch (err) {
      this.throwError('Failed to write to file', err as Error)
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    this.logger.logInfo('Execing command')

    try {
      await this.shell.exec(cmd, ...args)
    } catch (err) {
      this.throwError('Failed to exec shell command', err as Error)
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    this.logger.logInfo('Fetching resource')

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
