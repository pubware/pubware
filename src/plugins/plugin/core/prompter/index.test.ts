import { jest } from '@jest/globals'

jest.unstable_mockModule('@inquirer/prompts', () => ({
  input: jest.fn(),
  confirm: jest.fn(),
  select: jest.fn()
}))

const { input, confirm, select } = await import('@inquirer/prompts')
const Prompter = (await import('./index.js')).default

describe('Prompter', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('prompts for input', async () => {
    const message = "What's your name?"
    const mockResponse = 'John Doe'
    jest.mocked(input).mockResolvedValue(mockResponse)
    const prompter = new Prompter()
    const response = await prompter.input(message)

    expect(input).toHaveBeenCalledWith({ message })
    expect(response).toBe(mockResponse)
  })

  test('throws error when input fails', async () => {
    const message = "What's your name?"
    jest.mocked(input).mockRejectedValue(new Error('Input failed'))
    const prompter = new Prompter()
    await expect(prompter.input(message)).rejects.toThrow('Input failed')
  })

  test('prompts for confirmation', async () => {
    const message = 'Are you sure?'
    jest.mocked(confirm).mockResolvedValue(true)
    const prompter = new Prompter()
    const response = await prompter.confirm(message)

    expect(confirm).toHaveBeenCalledWith({ message })
    expect(response).toBe(true)
  })

  test('prompts for choice selection', async () => {
    const message = 'Select an option'
    const choices = [
      { name: 'Option 1', value: '1' },
      { name: 'Option 2', value: '2' }
    ]
    jest.mocked(select).mockResolvedValue('1')
    const prompter = new Prompter()
    const response = await prompter.select(message, choices)

    expect(select).toHaveBeenCalledWith({
      message,
      choices
    })
    expect(response).toBe('1')
  })
})
