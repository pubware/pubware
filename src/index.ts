import { createCLI } from './lib/cli.js'
import { packageJsonPath } from './lib/context.js'
import { updateVersion } from './lib/operations/update-version.js'
import { createBuild } from './lib/operations/create-build.js'

async function main() {
  const cli = createCLI()

  await updateVersion(packageJsonPath, 'patch')
  await createBuild()
}

main()
