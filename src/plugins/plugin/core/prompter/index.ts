import { confirm, input, select, Separator } from '@inquirer/prompts'

interface Choice {
  name?: string
  value: string
  description?: string
}

export type Choices = (Choice | Separator)[]

/**
 * Class responsible for handling interactive command line prompts.
 */
class Prompter {
  /**
   * Prompt the user for generic input.
   * @param {string} message The message to display to the user.
   * @returns {Promise<string>} A promise that resolves to the user's input.
   * @throws {Error} Throws an error if the input prompt fails.
   */
  async input(message: string): Promise<string> {
    try {
      return await input({ message })
    } catch (err) {
      throw err
    }
  }

  /**
   * Prompt the user with a yes/no confirmation.
   * @param {string} message The confirmation message to display to the user.
   * @returns {Promise<boolean>} A promise that resolves to the user's boolean response.
   * @throws {Error} Throws an error if the confirmation prompt fails.
   */
  async confirm(message: string): Promise<boolean> {
    try {
      return await confirm({ message })
    } catch (err) {
      throw err
    }
  }

  /**
   * Prompt the user with a list of choices.
   * @param {string} message The message to display above the choices.
   * @param {Choices} choices The choices available for selection.
   * @returns {Promise<string>} A promise that resolves to the value of the selected choice.
   * @throws {Error} Throws an error if the select prompt fails.
   */
  async select(message: string, choices: Choices): Promise<string> {
    try {
      return await select({ message, choices })
    } catch (err) {
      throw err
    }
  }
}

export default Prompter
