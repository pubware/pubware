import PluginError from './lib/error.js'
import { Flags } from './lib/flags.js'
import Logger from '../core/logger/index.js'
import Prompter, { Choices } from '../core/prompter/index.js'
import Shell from '../core/shell/index.js'
import FileSystem from '../core/fs/index.js'
import HTTP from '../core/http/index.js'

abstract class Plugin {
  private _name: string
  private _flags: Flags
  private logger: Logger
  private prompter: Prompter
  private shell: Shell
  private fs: FileSystem
  private http: HTTP

  constructor(name: string) {
    this._name = name
    this._flags = {
      dryRun: false,
      headless: false
    }
    this.logger = new Logger(name)
    this.prompter = new Prompter()
    this.shell = new Shell()
    this.fs = new FileSystem()
    this.http = new HTTP()
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
      return await this.prompter.input(message)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to prompt user',
        err as Error,
        this.logger
      )
    }
  }

  async promptConfirm(message: string): Promise<boolean> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.prompter.confirm(message)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to prompt user',
        err as Error,
        this.logger
      )
    }
  }

  async promptSelect(message: string, choices: Choices): Promise<string> {
    this.logger.logInfo('Prompting user')

    try {
      return await this.prompter.select(message, choices)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to prompt user',
        err as Error,
        this.logger
      )
    }
  }

  async read(path: string): Promise<string> {
    this.logger.logInfo(`Reading file: ${path}`)

    try {
      return await this.fs.read(path)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to read user',
        err as Error,
        this.logger
      )
    }
  }

  async write(path: string, data: string): Promise<void> {
    this.logger.logInfo(`Writing to file: ${path}`)

    try {
      await this.fs.write(path, data)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to write to file',
        err as Error,
        this.logger
      )
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    this.logger.logInfo('Execing command')

    try {
      await this.shell.exec(cmd, ...args)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to execute command',
        err as Error,
        this.logger
      )
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    this.logger.logInfo('Fetching resource')

    try {
      return await this.http.fetch(url, options)
    } catch (err) {
      throw new PluginError(
        this.name,
        'Failed to fetch resource',
        err as Error,
        this.logger
      )
    }
  }

  init?(): void
  preBump?(): void
  bump?(): void
  prePublish?(): void
  publish?(): void
  postPublish?(): void
}

export default Plugin
