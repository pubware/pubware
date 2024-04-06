import CLI from './lib/cli.js'
import PluginController from './plugins/plugin-controller.js'
import NPM from './plugins/npm.js'
import Git from './plugins/git.js'

async function main() {
  // Initialize CLI and process args
  const cli = new CLI()
  const args = process.argv

  cli.run(args)

  // Initialize plugins
  const controller = new PluginController()
  const npm = new NPM()
  const git = new Git()

  // Register initial lifecycle events
  controller
    .on('pre', () => npm.bump('patch'))
    // .on('intra', () => git.CTP())
    .on('post', () => npm.publish())

  // Register custom hooks
  controller
    .on('pre', () => npm.build())
    .on('post', () => console.log('finished!'))

  // Execute hooks
  await controller.execAll()
}

await main()
