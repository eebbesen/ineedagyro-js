process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const agent = require('supertest').agent(require('../../app'))

const Yelp = require('node-yelp-api-v3')

const sinon = require('sinon')
var sandbox

describe('router', function(){
  beforeEach(function(){
    sandbox = sinon.sandbox.create()
    stub = sandbox.stub(Yelp.prototype, 'searchBusiness')
  })

  afterEach(function(){
    sandbox.restore()
  })

  it ('should render index at /', (done) => {
    agent
      .get('/')
      .end(function(err, res) {
        res.status.should.equal(200)
        res.text.should.contain('open_gyro_outline_500.jpeg')

        done()
      })
  })

  it ('should render index at /recs with locs', (done) => {
    stub.resolves({
      businesses: [{
        url: 'https://fakestaurant.com/1',
        name: 'Gyro Hero',
        location: {
          address1: '1600 Grand Ave'
        }
      }]
    })

    agent
      .get('/recs')
      .query({lat: 44, lng: 93})
      .end(function(err, res) {
        res.status.should.equal(200)
        res.text.should.contain('Hero')
        stub.called.should.equal(true)

        done()
      })
  })

  it ('should render index at /recs with nothing', (done) => {
    stub.resolves({
      businesses: [{}]
    })

    agent
      .get('/recs')
      .query({lat: 44, lng: 93})
      .end(function(err, res) {
        res.status.should.equal(200)
        res.text.should.equal('{"locs":[{}]}')
        stub.called.should.equal(true)

        done()
      })
  })

  it ('should render privacy policy at /privacy', (done) => {
    stub.resolves({
      businesses: [{}]
    })

    agent
      .get('/privacy')
      .end(function(err, res) {
        res.status.should.equal(200)
        res.text.should.contain('this gyro service')

        done()
      })
  })
})
