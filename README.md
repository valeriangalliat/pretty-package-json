# pretty-package-json [![npm version](http://img.shields.io/npm/v/pretty-package-json.svg?style=flat-square)](https://www.npmjs.org/package/pretty-package-json)

> Prettier for `package.json`.

## Overview

I like my `package.json` files to be nearly organized, making sure that
each property is in the same order as listed in the official [npm `package.json` documentation][documentation],
including nested objects like `author`, `contributors`, `directories`
and more.

[documentation]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json

This tools allows me to stop doing that manually. I just
`%!pretty-package-json` from Vim and call it a day.

## Usage

Format given file, `stdin` or `package.json` otherwise according to
[rules](#rules), and print it to `stdout`:

```sh
pretty-package-json whatever.json
pretty-package-json < whatever.json
pretty-package-json
```

Format given file or `package.json` otherwise, and overwrite it:

```sh
pretty-package-json --write whatever.json
pretty-package-json --write
```

## Rules

The top-level keys are sorted as defined in the [documentation].

<details>
  <summary>Reveal top-level keys</summary>

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
1. `overrides`
1. `engines`
1. `os`
1. `cpu`
1. `private`
1. `publishConfig`
1. `workspaces`

</details>

Those are [automatically fetched](Makefile) from the documentation. But
for nested object keys, there's extra rules that need to be
[defined manually](rules.js) (see below).

We also support [extra keys](#extra-keys) that are not part of the npm
documentation but are commonly used in the ecosystem, like `type`,
`module`, `exports`, and `types`.

### Sorting and unknown keys

Anywhere we're sorting according to a predefined order, unknown keys
will be added at the end in the same order they were found.

### Empty structures

Empty arrays and objects are removed.

### Redundant `homepage` and `bugs`

If the `homepage` and `bugs` match the one that can be derived from
the `repository` by [hosted-git-info](https://www.npmjs.com/package/hosted-git-info),
the keys will be removed.

For example:

```json
{
  "homepage": "https://github.com/valeriangalliat/pretty-package-json",
  "bugs": "https://github.com/valeriangalliat/pretty-package-json/issues",
  "repository": "valeriangalliat/pretty-package-json"
}
```

Here the `homepage` and `bugs` are redundant and it will be rewritten
as:

```json
{
  "repository": "valeriangalliat/pretty-package-json"
}
```

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

### Extra keys

* [`$schema`](https://json-schema.org/draft/2020-12/json-schema-core.html#keyword-schema):
  for JSON Schema validation.
* [`type`](https://nodejs.org/api/packages.html#type): Node.js input
  type, e.g. `"type": "module"` or `"type": "commonjs"`.
* [`module`](https://nodejs.org/api/packages.html#packages_dual_commonjs_es_module_packages):
  Node.js legacy method that allowed to define the ES module entry
  point, as opposed to CommonJS in `main`.
* [`exports`](https://nodejs.org/api/packages.html#exports): Node.js
  field allowing to define hybrid entry points.
* [`types`](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html):
  TypeScript types.

To confirm this list and see the non-npm top-level keys that were
manually added, run:

```sh
git diff --no-index npm-keys.json keys.json
```
