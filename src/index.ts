import chalk from 'chalk'
import { Command } from 'commander'

const program = new Command()

program
  .name('packpub')
  .description(chalk.blue('CLI tool to publish packages'))
  .version(chalk.yellow('0.0.0'))

program.parse()
