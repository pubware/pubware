import chalk from 'chalk'
import { Command } from 'commander'
import { shExec } from './lib/exec.js'
import { fsRead } from './lib/read.js'

const program = new Command()

program
  .name('packpub')
  .description(chalk.blue('CLI tool to publish packages'))
  .version(chalk.yellow('0.0.0'))

program.parse()

// Begin publish lifecycle
fsRead('./package.json').then(() => {
  try {
    shExec('pnpm build')
  } catch (err) {
    console.error(err)
  }
})
