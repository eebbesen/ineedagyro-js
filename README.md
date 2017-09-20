# ineedagyro-js
Gyros near you!

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
```
npm test
```
will run mocha for the server-side JavaScript and karma for the client-side tests
