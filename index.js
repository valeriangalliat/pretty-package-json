const parseAuthor = require('parse-author')
const stringifyAuthor = require('stringify-author')
const hostedGitInfo = require('hosted-git-info')
const sortedKeys = require('./keys')

function sortObject (sortedKeys, object) {
  const newObject = {}

  for (const key of sortedKeys) {
    if (key in object) {
      newObject[key] = object[key]
    }
  }

  // Append unknown keys at the end.
  for (const key of Object.keys(object)) {
    if (!(key in newObject)) {
      newObject[key] = object[key]
    }
  }

  return newObject
}

function alphabeticalSortObject (object) {
  const sortedKeys = Object.keys(object).sort()
  const newObject = {}

  for (const key of sortedKeys) {
    if (key in object) {
      newObject[key] = object[key]
    }
  }

  return newObject
}

const rules = {
  author (author, opts) {
    if (typeof author === 'string') {
      author = parseAuthor(author)
    }

    return opts.peopleFormat === 'long' ? sortObject(['name', 'email', 'url'], author) : stringifyAuthor(author)
  },
  contributors (contributors, opts) {
    return contributors.map(contributor => rules.author(contributor, opts))
  },
  bin (bin, opts, pkg) {
    if (typeof bin === 'string') {
      return bin
    }

    if (Object.keys(bin).length !== 1) {
      return bin
    }

    if (pkg.name in bin) {
      return bin[pkg.name]
    }
  },
  directories (directories) {
    return sortObject(['bin', 'doc', 'lib', 'man'], directories)
  },
  repository (repository) {
    if (typeof repository === 'string') {
      const info = hostedGitInfo.fromUrl(repository)
      return info ? info.shortcut().replace(/^github:/, '') : repository
    }

    if (repository.type !== 'git' || ('directory' in repository)) {
      return sortObject(['type', 'url', 'directory'], repository)
    }

    return rules.repository(repository.url)
  },
  scripts (scripts, opts) {
    return opts.sortScripts ? alphabeticalSortObject(scripts) : scripts
  },
  dependencies: alphabeticalSortObject,
  devDependencies: alphabeticalSortObject,
  peerDependencies: alphabeticalSortObject,
  optionalDependencies: alphabeticalSortObject,
  engines (engines) {
    return sortObject(['node', 'npm'], engines)
  }
}

function prettyPackageJson (pkg, opts = {}) {
  opts = Object.assign({}, prettyPackageJson.defaults, opts)

  for (const key of Object.keys(pkg)) {
    if (Array.isArray(pkg[key] && !pkg[key].length)) {
      delete pkg[key]
    }

    if (typeof pkg[key] === 'object' && !Object.keys(pkg[key]).length) {
      delete pkg[key]
    }
  }

  pkg = sortObject(sortedKeys, pkg)

  for (const [key, rule] of Object.entries(rules)) {
    if (key in pkg) {
      pkg[key] = rule(pkg[key], opts, pkg)
    }
  }

  return pkg
}

prettyPackageJson.defaults = {
  sortScripts: true,
  peopleFormat: 'string'
}

module.exports = prettyPackageJson
