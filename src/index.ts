import chalk from 'chalk'
import { Command } from 'commander'
import { fsRead } from './lib/fs/read.js'
import { shExec } from './lib/shell/exec.js'

const program = new Command()

program
  .name('packpub')
  .description(chalk.blue('CLI tool to publish packages'))
  .version(chalk.yellow('0.0.0'))

program.parse()

// Begin publish lifecycle
fsRead('./package.json').then(() => {
  try {
    shExec('npm run build')
  } catch (err) {
    console.error(err)
  }
})
