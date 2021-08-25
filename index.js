const { sortObject } = require('./sort')
const rules = require('./rules')
const sortedKeys = require('./keys')

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
