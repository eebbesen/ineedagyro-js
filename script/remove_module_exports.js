const fs = require('fs')

// `file` is relative to project root directory
function dropExports(file, toFile) {
  const text = fs.readFileSync(file).toString()
  // console.log('xxxxx', file, text.toString())
  const nt = text.split('module.exports')[0]
  fs.writeFileSync(toFile, nt)

  console.log(`Removed exports from ${file} and saved to ${toFile}`)
}

['script.js'].forEach( f => {
  dropExports(`src/${f}`, `public/js/${f}`)
})


