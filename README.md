# ineedagyro-js
Gyros near you!

https://ineedagyro.com

## How?
Uses browser's `navigation.geolocation.getCurrentPosition()` to query [Yelp's Fusion API](https://www.yelp.com/developers/documentation/v3/business_search) using [node-yelp-api-v3](https://github.com/joshuaslate/node-yelp-api).

## Run
1. Get API ID and secret from [Yelp](https://www.yelp.com/developers/v3/manage_app)
1. Set those values in your environment
```
export YELP_KEY=<your_yelp_API_ID>
export YELP_SECRET=<your_yelp_API_secret>
```

### Using npm directly
```
npm install
npm start
```

### Using Docker
#### Build
To ensure you're not using an out-of-date image
```
docker-compose build
```

#### Run
```
docker-compose up -d
```
Then browse to http://localhost:8081/

#### Other options
If you want to view logs, omit `-d` from the previous command _or_
```
docker-compose logs -f
```

## Test
Make sure karma-chrome-launcher is installed. This may cause problems with CI.
```
npm install karma-chrome-launcher --save-dev --link
```
Run tests
```
npm test
```
will run mocha for the server-side JavaScript and karma for the client-side tests

## Helpy things
### cURL
#### Get token
Assuming you've set environment variables as shown above:
```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "client_id=$YELP_KEY&client_secret=$YELP_SECRET" https://api.yelp.com/oauth2/token
```

#### Call with token
Export the Yelp token you received (see above)
`export YELP_TOKEN=<see_get_token_section>`
then execute the request
```
curl -H "Authorization: Bearer $YELP_TOKEN" https://api.yelp.com/v3/businesses/search?location=48226&term=gyro
```
