const parseAuthor = require('parse-author')
const stringifyAuthor = require('stringify-author')
const hostedGitInfo = require('hosted-git-info')
const { sortObject, alphabeticalSortObject } = require('./sort')

function bugs (bugs) {
  if (typeof bugs === 'string') {
    return bugs
  }

  if (Object.keys(bugs).length === 1 && ('url' in bugs)) {
    return bugs.url
  }

  return sortObject(['url', 'email'], bugs)
}

function author (author, opts) {
  if (typeof author === 'string') {
    author = parseAuthor(author)
  }

  if (opts.peopleFormat === 'long') {
    return sortObject(['name', 'email', 'url'], author)
  }

  return stringifyAuthor(author)
}

function contributors (contributors, opts) {
  return contributors.map(contributor => author(contributor, opts))
}

function bin (bin, opts, pkg) {
  if (typeof bin === 'string') {
    return bin
  }

  if (Object.keys(bin).length !== 1) {
    return bin
  }

  if (pkg.name in bin) {
    return bin[pkg.name]
  }
}

function directories (directories) {
  return sortObject(['bin', 'doc', 'lib', 'man'], directories)
}

function repository (repo, opts, pkg) {
  if (typeof repo !== 'string') {
    if (repo.type !== 'git' || ('directory' in repo)) {
      return sortObject(['type', 'url', 'directory'], repo)
    }

    return repository(repo.url, opts, pkg)
  }

  const info = hostedGitInfo.fromUrl(repo)

  if (!info) {
    return repo
  }

  if (('homepage' in pkg) && (info.docs() === pkg.homepage || info.browse() === pkg.homepage)) {
    delete pkg.homepage
  }

  if (('bugs' in pkg) && (info.bugs() === (pkg.bugs.url || pkg.bugs))) {
    delete pkg.bugs
  }

  return info.shortcut().replace(/^github:/, '')
}

function scripts (scripts, opts) {
  return opts.sortScripts ? alphabeticalSortObject(scripts) : scripts
}

function engines (engines) {
  return sortObject(['node', 'npm'], engines)
}

module.exports = {
  bugs,
  author,
  contributors,
  bin,
  directories,
  repository,
  scripts,
  dependencies: alphabeticalSortObject,
  devDependencies: alphabeticalSortObject,
  peerDependencies: alphabeticalSortObject,
  optionalDependencies: alphabeticalSortObject,
  engines
}
