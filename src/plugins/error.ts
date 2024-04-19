class PluginError extends Error {
  pluginName: string
  message: string
  cause: Error

  constructor(pluginName: string, message: string, cause: Error) {
    super(message)
    this.name = 'PluginError'
    this.pluginName = pluginName
    this.message = message
    this.cause = cause
  }
}

export default PluginError
