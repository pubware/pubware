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
    this.logger.info('Prompting user')

    try {
      return await this.prompter.input(message)
    } catch (err) {
      this.logger.error('Failed to prompt user')
      throw err
    }
  }

  async promptConfirm(message: string): Promise<boolean> {
    this.logger.info('Prompting user')

    try {
      return await this.prompter.confirm(message)
    } catch (err) {
      this.logger.error('Failed to prompt user')
      throw err
    }
  }

  async promptSelect(message: string, choices: Choices): Promise<string> {
    this.logger.info('Prompting user')

    try {
      return await this.prompter.select(message, choices)
    } catch (err) {
      this.logger.error('Failed to prompt user')
      throw err
    }
  }

  async read(path: string): Promise<string> {
    this.logger.info(`Reading file: ${path}`)

    try {
      return await this.fs.read(path)
    } catch (err) {
      this.logger.error('Failed to read file')
      throw err
    }
  }

  async write(path: string, data: string): Promise<void> {
    this.logger.info(`Writing to file: ${path}`)

    try {
      await this.fs.write(path, data)
    } catch (err) {
      this.logger.error('Failed to write to file')
      throw err
    }
  }

  async exec(cmd: string, ...args: string[]): Promise<void> {
    this.logger.info(`Execing command: ${cmd} ${args.join(' ').trim()}`)

    try {
      await this.shell.exec(cmd, ...args)
    } catch (err) {
      this.logger.error('Failed to execute command')
      throw err
    }
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    this.logger.info('Fetching resource')

    try {
      return await this.http.fetch(url, options)
    } catch (err) {
      this.logger.error('Failed to fetch resource')
      throw err
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
