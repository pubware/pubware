<div align="center">
  <h1>packpub</h1>
  <img src="https://i.ibb.co/18HCfhG/packpub-logo.png" alt="logo" height="75%" width="75%" />
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

Packpub is an **agnostic** and **extensible** package publisher. Agnostic refers to the ability to be used in a variety of environments. Packpub can be run with any `npm`, `yarn`, `pnpm` project, or other publishing processes (Python packages, Ruby gems, etc.) with a Node runtime. Extensibility refers to the ability to add additional functionality. Packpub can be bundled with community-made plugins to extend publishing capabilities.

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

Install `@packpub/packpub` as a dev dependency:

```zsh
npm install -D @packpub/packpub
```

Add the `publish` script to `package.json`:

```json
"scripts": {
  "publish": "packpub"
}
```

## Usage

Run the command:

```zsh
npm run publish
```

Or with `npx`:

```zsh
npx packpub
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

Configuration files are supported either with a `packpub.json` file or within `package.json`. Pass values to plugins based on plugin-specific parameters.

```json
{
  "packpub": {
    "plugins": {
      "internal": {
        "npm": {},
        "git": {}
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

Plugins extend the functionality of packpub and can be tailored to any project. Plugins are defined in the configuration file as either `internal` or `external`. The `internal` plugins come pre-bundled with packpub, such as the `npm` and `git` plugins. The `external` plugins represent the additional project-based plugins.

### Internal

Both `internal` plugins, `npm` and `git`, have a unique `disabled` attribute, as well as their original configuration:

```json
{
  "internal": {
    "npm": {
      "disabled": false
    },
    "git": {
      "disabled": false
    }
  }
}
```

Learn more about the [npm](https://github.com/packpub/npm) and [git](https://github.com/packpub/git) plugins.

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
> Plugin `key` must match the dependency name when referencing a plugin from `node_modules`

Local plugins are also supported:

```json
{
  "external": {
    "./plugin.js": {}
  }
}
```

### Creating Plugins

Plugins support various utility methods and lifecycle hooks that make it easy to build and integrate with packpub.

Learn more about [creating plugins](https://github.com/packpub/plugin).

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
pnpm packpub
# or
pnpm run packpub
```

## License

MIT
