type Level = 'debug' | 'info' | 'warn' | 'error'
type Details = Record<string, any>
type Log = {
  level: Level
  message: string
  timestamp: Date
  details?: Details
}

interface GenericLogger {
  log(level: Level, message: string, details?: Details): void
  flush(): void
  logs: Log[]
}

class Logger implements GenericLogger {
  private _logs: Log[] = []

  get logs(): Log[] {
    return this._logs
  }

  log(level: Level, message: string, details?: Details) {
    const timestamp = new Date()
    this._logs.push({
      level,
      message,
      timestamp,
      details
    })
  }

  // TODO
  flush() {}
}

export default Logger
