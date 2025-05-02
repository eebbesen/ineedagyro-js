import express from 'express';
const router = express.Router();
import { redirectToHTTPS } from 'express-http-to-https';
import Yelp from 'yelp-fusion';
import { execSync } from 'child_process';

// redirect to https except when local or testing
router.use(redirectToHTTPS([/localhost:8080/, /127.0.0.1:8080/], []));

function buildRequest(req) {
  console.log('lat', req.query.lat);
  console.log('long', req.query.lng);
  console.log('term', req.query.term);

  return {
    term: req.query.term ?? 'gyro',
    latitude: req.query.lat,
    longitude: req.query.lng,
    sort_by: 'distance',
  };
}

// HEROKU_BUILD_COMMIT is exposed on Heroku
function gitSha() {
  let sha = ''
  try {
    sha = process?.env?.HEROKU_BUILD_COMMIT === 'undefined' ?
      execSync('git rev-parse HEAD')?.toString()?.trim() :
      process?.env?.HEROKU_BUILD_COMMIT;
  } catch (e) {
    console.log('error getting sha', e);
  }

  return sha === 'undefined' ? 'error getting sha' : sha;
}

router.get('/version', function (req, res) {
  res.send({ version: gitSha() });
});

router.get('/recs', function (req, res) {
  const s = buildRequest(req);

  const yelp = Yelp.client(process.env.YELP_API_KEY);
  yelp
    .search(s)
    .then((results) => {
      res.send({ locs: results.jsonBody.businesses });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/', function (req, res) {
  res.render('index', { locs: [] });
});

router.get('/privacy', function (req, res) {
  res.render('privacy_policy');
});

export default router;
export { buildRequest, gitSha };
