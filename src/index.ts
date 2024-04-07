import CLI from './lib/cli.js'
import PluginController from './plugins/plugin-controller.js'
import NPM from './plugins/npm.js'
import Git from './plugins/git.js'

async function main() {
  // Initialize CLI
  await CLI.run()

  // Initialize plugins
  const controller = new PluginController()
  const npm = new NPM()
  const git = new Git()

  // Register lifecycle events
  // TODO:
  //   - Initialize core `pre`, `intra`, `post` hooks (should these be hooks?)
  //   - Then, add custom hooks
  controller
    .on('pre', async () => {
      await npm.build()
      // Last `pre` hook, insert before
      await npm.bump('patch')
    })
    .on('intra', async () => {
      // Last `intra` hook, insert before
      // await git.CTP()
    })
    .on('post', async () => {
      // First `post` hook, insert after
      await npm.publish()
      console.log('finished!')
    })

  // Execute hooks
  await controller.execAll()
}

await main()
