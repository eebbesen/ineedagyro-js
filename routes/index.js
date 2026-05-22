import express from 'express';
const router = express.Router();
import { redirectToHTTPS } from 'express-http-to-https';
import Yelp from 'yelp-fusion';
import { execSync } from 'child_process';

// redirect to https except when local or testing
router.use(redirectToHTTPS([/localhost/, /127\.0\.0\.1/], []));

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
  const envSha = process.env.HEROKU_BUILD_COMMIT;
  if (envSha && envSha !== 'undefined') return envSha;
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    console.log('error getting sha', e);
    return 'error getting sha';
  }
}

router.get('/version', (req, res) => {
  res.send({ version: gitSha() });
});

router.get('/recs', async (req, res) => {
  const s = buildRequest(req);
  const yelp = Yelp.client(process.env.YELP_API_KEY);
  try {
    const results = await yelp.search(s);
    res.send({ locs: results.jsonBody.businesses });
  } catch (err) {
    console.log(err);
  }
});

router.get('/', (req, res) => {
  res.render('index', { locs: [] });
});

router.get('/privacy', (req, res) => {
  res.render('privacy_policy');
});

export default router;
export { buildRequest, gitSha };
