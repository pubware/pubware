import Logger from '../../core/logger/index.js'

class PluginError extends Error {
  pluginName: string
  message: string
  cause: Error
  logger: Logger

  constructor(
    pluginName: string,
    message: string,
    cause: Error,
    logger: Logger
  ) {
    super(message)
    this.name = 'PluginError'
    this.pluginName = pluginName
    this.message = message
    this.cause = cause
    this.logger = logger
    this.logger.error(message)
  }
}

export default PluginError
