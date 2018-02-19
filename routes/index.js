const express = require('express')
const router = express.Router()
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

const Yelp = require('node-yelp-api-v3')
const yelp = new Yelp({
  consumer_key: process.env.YELP_KEY,
  consumer_secret: process.env.YELP_SECRET
})

// redirect to https except when local or testing
router.use(redirectToHTTPS([/localhost:8081/, /127.0.0.1:8080/], []))

router.get('/recs', function(req, res){
  const s = {
    term: 'gyro',
    latitude: req.query.lat,
    longitude: req.query.lng,
    sort_by: 'distance'
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

router.get('/privacy', function(req, res){
  res.render('privacy_policy')
})

module.exports = router
