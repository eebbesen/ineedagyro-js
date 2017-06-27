var express =  require('express')
var request = require('request')
var bodyParser = require('body-parser')
var yelp = require('node-yelp-api-v3')
var app = express()

var indexRoutes = require('./routes/index')
app.use(indexRoutes)

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


const port = process.env.PORT || 8080
var server = app.listen(port, function(){
  console.log('listening at ' + port)
})

module.exports = server
