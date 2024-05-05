const logBase = jest.fn()

jest.mock('../core/logger/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    log: logBase,
    info: jest.fn(),
    error: jest.fn()
  }))
}))

const fsRead = jest.fn()
const fsWrite = jest.fn()

jest.mock('../core/fs/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    read: fsRead,
    write: fsWrite
  }))
}))

const promptInput = jest.fn()
const promptConfirm = jest.fn()
const promptSelect = jest.fn()

jest.mock('../core/prompter/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    input: promptInput,
    confirm: promptConfirm,
    select: promptSelect
  }))
}))

const shExec = jest.fn()

jest.mock('../core/shell/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    exec: shExec
  }))
}))

const httpFetch = jest.fn()

jest.mock('../core/http/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    fetch: httpFetch
  }))
}))

export {
  logBase,
  fsRead,
  fsWrite,
  promptInput,
  promptConfirm,
  promptSelect,
  shExec,
  httpFetch
}
