# pretty-package-json

> Prettier for `package.json`.

## Overview

I like my `package.json` files to be nearly organized, making sure that
each property is in the same order as listed in the official [npm `package.json` documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json),
including nested objects like `author`, `contributors`, `directories`
and more.

This tools allows me to stop doing that manually. I just
`%!pretty-package-json` from Vim and call it a day.

## Rules

The top-level keys are sorted as defined in the [documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json):

1. `name`
1. `version`
1. `description`
1. `keywords`
1. `homepage`
1. `bugs`
1. `license`
1. `author`
1. `contributors`
1. `funding`
1. `files`
1. `main`
1. `browser`
1. `bin`
1. `man`
1. `directories`
1. `repository`
1. `scripts`
1. `config`
1. `dependencies`
1. `devDependencies`
1. `peerDependencies`
1. `peerDependenciesMeta`
1. `bundledDependencies`
1. `optionalDependencies`
1. `engines`
1. `os`
1. `cpu`
1. `private`
1. `publishConfig`
1. `workspaces`

Those are [automatically fetched](Makefile) from the documentation. But
there's more rules that need to be defined explicitly, also based on the
current documentation.

Anywhere we're sorting according to a predefined order, unknown keys
will be added at the end in the same order they were found.

Empty arrays and objects are removed.

If the `homepage` and `bugs` match the one that can be derived from
`repository` by [hosted-git-info](https://www.npmjs.com/package/hosted-git-info),
the keys will be removed.

### `author` and `contributors`

Converted to the short form `name <email> (url)` unless `peopleFormat`
is set to `object`, then it's sorted as:

1. `name`
1. `email`
1. `url`

### `bin`

If contains only a single script matching the package name, it's
flattened as a string.

### `directories`

1. `bin`
1. `doc`
1. `lib`
1. `man`

### `repository`

Convert to the shortest form supported, e.g. `use/repo` if hosted on
GitHub, `gitlab:user/repo`, a full URL, or otherwise sorted as:

1. `type`
1. `url`
1. `directory`

### `scripts`

Sorted alphabetically unless `sortScripts` is set to `false`.

### `dependencies`, `devDependencies`, `peerDependencies` and `optionalDependencies`

Sorted alphabetically like npm does by default when populating those
objects.

### `engines`

1. `node`
1. `npm`
