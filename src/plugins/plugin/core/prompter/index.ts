import { confirm, input, select, Separator } from '@inquirer/prompts'

interface Choice {
  name?: string
  value: string
  description?: string
}

export type Choices = (Choice | Separator)[]

class Prompter {
  async input(message: string): Promise<string> {
    try {
      return await input({ message })
    } catch (err) {
      throw err
    }
  }

  async confirm(message: string): Promise<boolean> {
    try {
      return await confirm({ message })
    } catch (err) {
      throw err
    }
  }

  async select(message: string, choices: Choices): Promise<string> {
    try {
      return await select({ message, choices })
    } catch (err) {
      throw err
    }
  }
}

export default Prompter
