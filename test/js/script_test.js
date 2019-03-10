process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const script = require('../../src/script')

describe('formatResults', () => {
  describe('has records', () => {
    const json = {'locs':[
      {'url':'https://fake.business.biz/1','name':'Hero Gyros','location':{'address1':'1600 Grand Ave'},'distance':1003.12},
      {'url':'https://fake.business.biz/2','name':'Russkaya Shaverma','location':{'address1':'900 University Ave'},'distance':88.67},
      {'url':'https://fake.business.biz/3','name':'Gyro Truck','location':{'address1':''},'distance':''}
    ]}

    it ('retuns a string of results', () => {
      const ret = script.formatResults(json)
      const expected = `
      <div class="results-header">
        <em>Results from Yelp!</em>
        <hr/>
      </div>
      <div class="container">
        <a class="button" href="https://fake.business.biz/1"><div class="outer">Hero Gyros<div class="address"><span class="lefty">1600 Grand Ave</span><span class="righty">0.62 miles</span></div></div></a>
        <a class="button" href="https://fake.business.biz/2"><div class="outer">Russkaya Shaverma<div class="address"><span class="lefty">900 University Ave</span><span class="righty">0.06 miles</span></div></div></a>
        <a class="button" href="https://fake.business.biz/3"><div class="outer">Gyro Truck<div class="address"><span class="lefty">food truck</span><span class="righty">Could be anywhere :)</span></div></div></a>
      </div>`
      ret.replace(/\s/g,'').should.equal(expected.replace(/\s/g,''))
    })
  })

  describe('has no locs', () => {
    it ('retuns an empty string', () => {
      const ret = script.formatResults('{"locs":[]}')
      ret.should.equal('<div>No results found within 40 km of you -- συγνώμη!</div>')
    })
  })

  describe('has no json', () => {
    it ('retuns an empty string', () => {
      const ret = script.formatResults('{}')
      ret.should.equal('<div>No results found within 40 km of you -- συγνώμη!</div>')
    })
  })
})

describe('locationError', () => {
  it ('displays error message', () => {
    const message = script.locationError({code: 2, message: 'bad things'})
    const expected = `
    <div class="gyro_error">
      <h1>We cannot find your gyros because we are unable to get your location from your browser :(. Please enable location sharing.</h1>
      <p>bad things</p>
      <p>error code: 2</p>
      </div>`
    message.replace(/\s/g,'').should.equal(
      expected.replace(/\s/g,''))
  })
})

describe('metersToMiles', () => {
  it ('converts properly', () => {
    script.metersToMiles(5000).should.equal('3.11')
  })
})

