var express = require('express')
var router = express.Router()

const Yelp = require('node-yelp-api-v3')
const yelp = new Yelp({
  consumer_key: process.env.YELP_KEY,
  consumer_secret: process.env.YELP_SECRET
})
const SEARCH = {
  term: 'gyro',
  location: 55104,
  radius: 2500
}

router.get('/', function(req, res){
  yelp.searchBusiness(SEARCH)
    .then((results) => {
      res.render('index', { locs: results.businesses })
    })
})

module.exports = router