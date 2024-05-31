 <center>
  <h1>pubware</h1>
  <center>
    <img src="https://img.shields.io/github/actions/workflow/status/pubware/pubware/ci.yml" alt="Build status" />
    <img src="https://badge.fury.io/js/pubware.svg" alt="Npm version" />
  </center>
  <img src="https://i.ibb.co/qxT05WK/pubware-logo.png" alt="logo" height="75%" width="75%" style="margin-top:10px;" />
  <p>Agnostic & extensible package publisher</p>
</center>

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

Pubware is an agnostic and extensible package publisher. Pubware supports any `npm`, `yarn`, `pnpm` project, or other publishing processes (Python packages, Ruby gems, etc.) with a Node runtime. Additionally, functionality can be extended with community-made plugins. Pubware can be customized to any publishing requirements.

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

#### `--dry-run`

Pass the `--dry-run` arg to run and report on what changes would have happened:

```zsh
npm run publish --dry-run
```

#### `--headless`

Pass the `--headless` arg to run without an interface (CI support):

```zsh
npm run publish --headless
```

## Configuration

Configuration is supported with a `pubware.json` file or within `package.json`. You can pass values to plugins based on plugin-specific parameters.

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
        "slack": {},
        "custom-plugin": {
          "key": "value"
        }
      }
    }
  }
}
```

## Plugins

Plugins extend the functionality of pubware and can be configured per project. Plugins are defined in the configuration as either `internal` or `external`. The `internal` plugins come pre-bundled with pubware, such as the `@pubware/npm` and `@pubware/git` plugins. The `external` plugins represent the additional project-based plugins. All plugins are executed in the order they are defined.

### Internal

The `internal` plugins, `@pubware/npm` and `@pubware/git`, have a unique `disabled` attribute, as well as their original configuration:

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

The `external` plugins can be used for any additional functionality:

```json
{
  "external": {
    "gitlab": {},
    "discord": {},
    "doordash": {}
  }
}
```

> [!IMPORTANT]
> A plugin must match the dependency import name when referencing from `node_modules`

Local plugins are also supported:

```json
{
  "external": {
    "./plugin.js": {}
  }
}
```

### Creating Plugins

Plugins support various utility methods and lifecycle hooks that make it easy to integrate with pubware.

Learn more about [creating plugins](https://github.com/pubware/plugin).

## Development

Install the modules:

```zsh
pnpm install
```

Create a build:

```zsh
pnpm build
```

Link the build to your global `node_modules`:

```zsh
pnpm link .
```

Run the build:

```zsh
pnpm pubware
```

## License

MIT
