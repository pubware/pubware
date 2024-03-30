import { createCLI } from './lib/cli.js'
import NPM from './plugins/npm.js'

async function main() {
  const cli = createCLI()
  const npm = new NPM()

  const version = await npm.bump('patch')
  await npm.build()
}

await main()
