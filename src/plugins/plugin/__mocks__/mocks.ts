const logBase = jest.fn()
const logInfo = jest.fn()
const logError = jest.fn()

beforeEach(() => {
  logInfo.mockReset()
  logError.mockReset()
})

jest.mock('../core/logger/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    log: logBase,
    info: logInfo,
    error: logError
  }))
}))

const fsRead = jest.fn()
const fsWrite = jest.fn()

beforeEach(() => {
  fsRead.mockReset()
  fsWrite.mockReset()
})

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

beforeEach(() => {
  promptInput.mockReset()
  promptConfirm.mockReset()
  promptSelect.mockReset()
})

jest.mock('../core/prompter/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    input: promptInput,
    confirm: promptConfirm,
    select: promptSelect
  }))
}))

const shExec = jest.fn()

beforeEach(() => {
  shExec.mockReset()
})

jest.mock('../core/shell/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    exec: shExec
  }))
}))

const httpFetch = jest.fn()

beforeEach(() => {
  httpFetch.mockReset()
})

jest.mock('../core/http/index.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    fetch: httpFetch
  }))
}))

export {
  logBase,
  logInfo,
  logError,
  fsRead,
  fsWrite,
  promptInput,
  promptConfirm,
  promptSelect,
  shExec,
  httpFetch
}
