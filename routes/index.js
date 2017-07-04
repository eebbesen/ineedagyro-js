var express = require('express')
var router = express.Router()

const Yelp = require('node-yelp-api-v3')
const yelp = new Yelp({
  consumer_key: process.env.YELP_KEY,
  consumer_secret: process.env.YELP_SECRET
})

router.get('/recs', function(req, res){
  var s = {
    term: 'gyro',
    latitude: req.query.lat,
    longitude: req.query.lng,
    radius: 2000
  }

  yelp.searchBusiness(s)
    .then((results) => {
      res.send({ locs: results.businesses })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/', function(req, res){
  res.render('index', { locs: [] })
})

module.exports = router