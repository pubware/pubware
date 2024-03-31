import CLI from './lib/cli.js'
import NPM from './plugins/npm.js'

async function main() {
  const args = process.argv
  const cli = new CLI()
  const npm = new NPM()

  cli.run(args)

  const version = await npm.bump('patch')
  await npm.build()
}

await main()
