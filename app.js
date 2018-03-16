let express =  require('express')
let bodyParser = require('body-parser')
let app = express()

let indexRoutes = require('./routes/index')
app.use(indexRoutes)

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


const port = process.env.PORT || 8080
let server = app.listen(port, function(){
  console.log('listening at ' + port)
})

module.exports = server
