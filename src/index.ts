import CLI from './lib/cli.js'
import PluginController from './plugins/plugin-controller.js'
import NPM from './plugins/npm.js'
import Git from './plugins/git.js'

async function main() {
  // Initialize CLI and process args
  const cli = new CLI()
  const args = process.argv

  cli.run(args)

  // Initialize plugins and register hooks
  const controller = new PluginController()
  const npm = new NPM()
  const git = new Git()

  controller.on('pre', () => npm.build()).on('pre', () => npm.bump('patch'))

  // Execute hooks
  await controller.execAll()
}

await main()
