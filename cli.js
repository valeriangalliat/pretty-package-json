const fs = require('fs')
const { docopt } = require('docopt')
const prettyPackageJson = require('.')
const { version } = require('./package')

const doc = `
Usage:
  pretty-package-json [--write] [<file>]
  pretty-package-json -h | --help
  pretty-package-json --version

Arguments:
  <file>  File to process, defaults to \`package.json\` or \`stdin\` if piped.

Options:
  -w, --write  Update file in place (has no effect when piped).
  -h, --help   Show this screen.
  --version    Show version.
`.trim()

function format (input, output) {
  const pkg = JSON.parse(fs.readFileSync(input, 'utf8'))
  fs.writeFileSync(output, JSON.stringify(prettyPackageJson(pkg), null, 2) + '\n')
}

function formatFile (file, write, or) {
  format(file, write ? file : or)

  if (write) {
    console.error(`Wrote: ${file}`)
  }
}

function cli (argv) {
  const args = docopt(doc, { argv, version })

  if (args['<file>']) {
    return formatFile(args['<file>'], args['--write'], '/dev/stdout')
  }

  if (process.stdin.isTTY) {
    return formatFile('package.json', args['--write'], '/dev/stdout')
  }

  return format('/dev/stdin', '/dev/stdout')
}

module.exports = cli
