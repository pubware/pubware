import CLI from './lib/cli.js'

async function main() {
  const cli = new CLI()
  await cli.run(process.argv)
}

await main()
