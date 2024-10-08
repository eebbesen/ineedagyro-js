process.env.NODE_ENV = 'test'

import { expect }  from 'chai'
import supertest from 'supertest'
import app from '../../app.js'
import Yelp from 'yelp-fusion'
const agent = supertest(app)

import sinon from 'sinon'
let sandbox
let stub

describe('router', function(){
  beforeEach(function(){
    sandbox = sinon.createSandbox()
    stub = sandbox.stub(Yelp, 'client')
  })

  afterEach(function(){
    sandbox.restore()
  })

  it ('should render index at /', (done) => {
    agent
      .get('/')
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        expect(res.text).to.contain('open_gyro_outline_500.jpeg')

        done()
      })
  })

  it ('should render index at /recs with locs', (done) => {
    stub.returns({
      search: function (){
        return new Promise(function(resolve) {
          resolve({jsonBody:
            {businesses: [{
              url: 'https://fakestaurant.com/1',
              name: 'Gyro Hero',
              location: {
                address1: '1600 Grand Ave'
              }
            }]}
          })
        })
      }
    })

    agent
      .get('/recs')
      .query({lat: 44, lng: 93})
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        expect(res.text).to.contain('Hero')
        expect(stub.called).to.equal(true)

        done()
      })
  })

  it ('should render index at /recs with nothing', (done) => {
    stub.returns({
      search: function (){
        return new Promise(function(resolve) {
          resolve({jsonBody: {businesses: [{}]}})
        })
      }
    })

    agent
      .get('/recs')
      .query({lat: 44, lng: 93})
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        expect(res.text).to.equal('{"locs":[{}]}')
        expect(stub.called).to.equal(true)

        done()
      })
  })

  it ('should render privacy policy at /privacy', (done) => {

    agent
      .get('/privacy')
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        expect(res.text).to.contain('this gyro service')

        done()
      })
  })
})
