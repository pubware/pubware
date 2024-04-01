import CLI from './lib/cli.js'
import PluginManager from './plugins/plugin-manager.js'
import NPM from './plugins/npm.js'
import Git from './plugins/git.js'

async function main() {
  // Initialize CLI and process args
  const cli = new CLI()
  const args = process.argv

  cli.run(args)

  // Initialize plugins and assign hooks
  const plugins = new PluginManager()
  const npm = new NPM()
  const git = new Git()

  plugins
    .addHook('pre', npm.build.bind(npm))
    .addHook('pre', npm.bump.bind(npm, 'patch'))

  // Execute hooks
  await plugins.execAll()
}

await main()
