import chalk from 'chalk'
import { Command } from 'commander'

console.log(chalk.blue('Hello world'))

const program = new Command()

program.description('CLI tool to publish packages').version('0.0.0')

program.parse()
