<div align="center">
  <h1>pubware</h1>
  <img src="https://i.ibb.co/qxT05WK/pubware-logo.png" alt="logo" height="75%" width="75%" />
  <p>Agnostic & extensible package publisher</p>
</div>

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Plugins](#plugins)
- [Development](#development)
- [License](#License)

## Overview

Pubware is an **agnostic** and **extensible** package publisher. Agnostic refers to the ability to be used with any `npm`, `yarn`, `pnpm` project, or other publishing processes (Python packages, Ruby gems, etc.) with a Node runtime. Extensibility refers to the ability to be bundled with community-made plugins to extend publishing capabilities. Pubware can be tailored to any project requirements.

### 🔥 Features

- 💡 Intuitive DX
- 🏗️ Built with type-safety
- 🚀 Performant and minimal
- 🤯 Headless support (run in CI)
- 🏃 Dry runs for testing
- 🔌 Extensible functionality
- 🔄 Lifecycle hooks

## Requirements

- Node 18+

## Installation

Install `pubware` as a dev dependency:

```zsh
npm install -D pubware
```

Add the `publish` script to `package.json`:

```json
"scripts": {
  "publish": "pubware"
}
```

## Usage

Run the command:

```zsh
npm run publish
```

Or with `npx`:

```zsh
npx pubware
```

### Args

Pass the `--dry-run` arg to run and report on what changes would have happened:

```zsh
npm run publish --dry-run
```

Pass the `--headless` arg to run without an interface (used for CI):

```zsh
npm run publish --headless
```

## Configuration

Configuration is supported either with a `pubware.json` file or within `package.json`. Pass values to plugins based on plugin-specific parameters.

```json
{
  "pubware": {
    "plugins": {
      "internal": {
        "@pubware/npm": {},
        "@pubware/git": {}
      },
      "external": {
        "github": {},
        "slack": {}
      }
    }
  }
}
```

## Plugins

Plugins extend the functionality of pubware and can be tailored to any project. Plugins are defined in the configuration file as either `internal` or `external`. The `internal` plugins come pre-bundled with pubware, such as the `@pubware/npm` and `@pubware/git` plugins. The `external` plugins represent the additional project-based plugins.

### Internal

Both `internal` plugins, `@pubware/npm` and `@pubware/git`, have a unique `disabled` attribute, as well as their original configuration:

```json
{
  "internal": {
    "@pubware/npm": {
      "disabled": false
    },
    "@pubware/git": {
      "disabled": false
    }
  }
}
```

Learn more about the [@pubware/npm](https://github.com/pubware/npm) and [@pubware/git](https://github.com/pubware/git) plugins.

### External

The `external` plugins are executed in the order they are defined:

```json
{
  "external": {
    "github": {},
    "slack": {},
    "doordash": {}
  }
}
```

> [!IMPORTANT]
> A plugin `key` must match the dependency import name when referencing from `node_modules`

Local plugins are also supported:

```json
{
  "external": {
    "./plugin.js": {}
  }
}
```

### Creating Plugins

Plugins support various utility methods and lifecycle hooks that make it easy to build and integrate with pubware.

Learn more about [creating plugins](https://github.com/pubware/plugin).

## Development

Install the modules and create a build:

```zsh
pnpm install
pnpm build
```

Link the build to your global `node_modules`:

```zsh
pnpm link .
```

Run the build:

```zsh
pnpm pubware
# or
pnpm run pubware
```

## License

MIT
