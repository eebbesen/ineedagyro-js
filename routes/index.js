import express from 'express'
const router = express.Router()
import { redirectToHTTPS } from 'express-http-to-https'
import Yelp from 'yelp-fusion'

// redirect to https except when local or testing
router.use(redirectToHTTPS([/localhost:8080/, /127.0.0.1:8080/], []))

router.get('/recs', function(req, res){
  const s = {
    term: 'gyro',
    latitude: req.query.lat,
    longitude: req.query.lng,
    sort_by: 'distance'
  }

  console.log('lat', req.query.lat)
  console.log('long', req.query.lng)

  const yelp = Yelp.client(process.env.YELP_API_KEY)
  yelp.search(s)
    .then((results) => {
      res.send({ locs: results.jsonBody.businesses })
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

export default router
