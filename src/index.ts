import CLI from './cli/index.js'

async function main() {
  const cli = new CLI()
  await cli.run(process.argv)
}

await main()
