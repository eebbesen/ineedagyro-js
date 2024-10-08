import fs from 'fs'

// for testing purposes we keep script.js in the src directory
// but for production we want it in the public/js directory

fs.copyFileSync('src/script.js', 'public/js/script.js')


