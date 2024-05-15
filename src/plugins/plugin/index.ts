import Logger from './core/logger/index.js'
import Prompter, { Choices } from './core/prompter/index.js'
import Shell from './core/shell/index.js'
import FileSystem from './core/fs/index.js'
import HTTP from './core/http/index.js'
import { Flags, ExecOptions } from './lib/types.js'

/**
 * Abstract class representing a plugin with various utility methods.
 * Provides functionality for logging, user prompting, file system operations,
 * shell commands, and HTTP requests.
 *
 * This class defines a series of lifecycle hooks that can be implemented by subclasses.
 * These hooks are designed to be called at specific stages of a plugin's lifecycle, providing
 * customizable behavior at critical events such as initialization, bumping, and publishing.
 *
 * Implementing the following hooks allows for control over the plugin's lifecycle:
 * - init: Called when the plugin is initialized.
 * - preBump: Called before the version is bumped.
 * - bump: Called to handle the version bump.
 * - prePublish: Called before the package is published.
 * - publish: Called to handle the publishing process.
 * - postPublish: Called after the package has been published.
 */
abstract class Plugin {
  private _name: string
  private _flags: Flags
  private logger: Logger
  private prompter: Prompter
  private shell: Shell
  private fs: FileSystem
  private http: HTTP

  /**
   * Create an instance of Plugin.
   * @param {string} name The name of the plugin.
   */
  constructor(name: string) {
    this._name = name
    this._flags = {
      dry: false,
      headless: false
    }
    this.logger = new Logger(name)
    this.prompter = new Prompter()
    this.shell = new Shell()
    this.fs = new FileSystem()
    this.http = new HTTP()
  }

  /**
   * Get name of the plugin.
   * @returns {string} The name of the plugin.
   */
  get name(): string {
    return this._name
  }

  /**
   * Get flags of the plugin.
   * @returns {Flags} The flags of the plugin.
   */
  get flags(): Flags {
    return this._flags
  }

  /**
   * Set flags of the plugin.
   * @param {Flags} flags The new flags for the plugin.
   */
  set flags(flags: Flags) {
    this._flags = { ...this._flags, ...flags }
  }

  /**
   * Log a message.
   * @param {string} message The message to log.
   */
  log(message: string) {
    this.logger.log(message)
  }

  /**
   * Prompt the user for generic input.
   * @param {string} message The prompt message.
   * @param {string} [defaultValue=''] The default value returned in headless mode.
   * @returns {Promise<string>} The input.
   * @throws {Error} Throws an error if prompt fails.
   */
  async prompt(message: string, defaultValue: string = ''): Promise<string> {
    this.logger.info('Prompting user')

    if (this.flags.headless) {
      return defaultValue
    }

    try {
      return await this.prompter.input(message)
    } catch (err) {
      this.logger.error('Failed to prompt user')
      throw err
    }
  }

  /**
   * Prompt the user for a boolean confirmation.
   * @param {string} message The confirmation message.
   * @param {boolean} [defaultValue=false] The default value returned in headless mode.
   * @returns {Promise<boolean>} The confirmation as true or false.
   * @throws {Error} Throws an error if prompt fails.
   */
  async promptConfirm(
    message: string,
    defaultValue: boolean = false
  ): Promise<boolean> {
    this.logger.info('Prompting user confirmation')

    if (this.flags.headless) {
      return defaultValue
    }

    try {
      return await this.prompter.confirm(message)
    } catch (err) {
      this.logger.error('Failed to prompt user')
      throw err
    }
  }

  /**
   * Prompt the user to select from a list of choices.
   * @param {string} message The message to display.
   * @param {Choices} choices The choices for selection.
   * @param {string} [defaultValue=''] The default value.
   * @returns {Promise<string>} The selected option.
   * @throws {Error} Throws an error if prompt fails.
   */
  async promptSelect(
    message: string,
    choices: Choices,
    defaultValue: string = ''
  ): Promise<string> {
    this.logger.info('Prompting user selection')

    if (this.flags.headless) {
      return defaultValue
    }

    try {
      return await this.prompter.select(message, choices)
    } catch (err) {
      this.logger.error('Failed to prompt user')
      throw err
    }
  }

  /**
   * Read the content of a file.
   * @param {string} path The path to the file.
   * @returns {Promise<string>} The content of the file.
   * @throws {Error} Throws an error if read fails.
   */
  async read(path: string): Promise<string> {
    this.logger.info(`Reading file: ${path}`)

    try {
      return await this.fs.read(path)
    } catch (err) {
      this.logger.error('Failed to read file')
      throw err
    }
  }

  /**
   * Write content to a file.
   * @param {string} path The file path where data will be written.
   * @param {string} content The content to write.
   * @returns {Promise<void>} A promise that resolves when the write is complete.
   * @throws {Error} Throws an error if write fails.
   */
  async write(path: string, content: string): Promise<void> {
    this.logger.info(`Writing to file: ${path}`)

    if (this.flags.dry) {
      this.logger.info('Aborting write-based file interaction during dry run')
      return
    }

    try {
      await this.fs.write(path, content)
    } catch (err) {
      this.logger.error('Failed to write to file')
      throw err
    }
  }

  /**
   * Execute a shell command.
   * @param {string} cmd The command to execute.
   * @param {ExecOptions} [options={ write: true }] Execution options.
   * @returns {Promise<void>} A promise that resolves when the command has been executed.
   * @throws {Error} Throws an error if execution fails.
   */
  async exec(
    cmd: string,
    options: ExecOptions = { write: true }
  ): Promise<void> {
    this.logger.info(`Execing command: ${cmd}`)

    if (this.flags.dry && options.write) {
      this.logger.info('Aborting write-based command during dry run')
      return
    }

    try {
      await this.shell.exec(cmd)
    } catch (err) {
      this.logger.error('Failed to execute command')
      throw err
    }
  }

  /**
   * Fetch a resource.
   * @param {string} url The URL of the resource to fetch.
   * @param {RequestInit} [options={}] Options for the HTTP request.
   * @returns {Promise<T>} A promise that resolves with the fetched resource.
   * @template T The expected type of the fetched resource.
   * @throws {Error} Throws an error if fetch fails.
   */
  async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    this.logger.info(`Fetching resource: ${url}`)

    try {
      return await this.http.fetch(url, options)
    } catch (err) {
      this.logger.error('Failed to fetch resource')
      throw err
    }
  }

  // Lifecycle hooks
  init?(): void
  preBump?(): void
  bump?(): void
  prePublish?(): void
  publish?(): void
  postPublish?(): void
}

export default Plugin
