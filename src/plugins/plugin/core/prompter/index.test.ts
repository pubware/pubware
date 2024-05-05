import { input, confirm, select } from '@inquirer/prompts'
import Prompter from './index.js'

jest.mock('@inquirer/prompts')

describe('Prompter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
    expect(async () => {
      const message = "What's your name?"
      const error = new Error('Input failed')
      jest.mocked(input).mockRejectedValue(error)

      const prompter = new Prompter()
      await prompter.input(message)
    }).rejects.toThrow('Input failed')
  })

  test('prompts for confirmation', async () => {
    const message = 'Are you sure?'
    const mockResponse = true
    jest.mocked(confirm).mockResolvedValue(mockResponse)

    const prompter = new Prompter()
    const response = await prompter.confirm(message)

    expect(confirm).toHaveBeenCalledWith({ message })
    expect(response).toBe(mockResponse)
  })

  test('prompts for choice selection', async () => {
    const message = 'Select an option'
    const choices = [
      { name: 'Option 1', value: '1' },
      { name: 'Option 2', value: '2' }
    ]
    const mockResponse = '1'
    jest.mocked(select).mockResolvedValue(mockResponse)

    const prompter = new Prompter()
    const response = await prompter.select(message, choices)

    expect(select).toHaveBeenCalledWith({
      message,
      choices
    })
    expect(response).toBe(mockResponse)
  })
})
