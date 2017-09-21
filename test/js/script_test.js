describe('formatResults', () => {
  describe('has records', () => {
    const json = {"locs":[
                   {"url":"https://fake.business.biz/1","name":"Hero Gyros","location":{"address1":"1600 Grand Ave"},"distance":1003.12},
                   {"url":"https://fake.business.biz/2","name":"Russkaya Shaverma","location":{"address1":"900 University Ave"},"distance":88.67},
                   {"url":"https://fake.business.biz/3","name":"Gyro Truck","location":{"address1":""},"distance":""}
                  ]}

    it ('retuns a string of results', () => {
      const ret = formatResults(json)
      const expected = `
      <div class="results-header">
        <em>Results from Yelp!</em>
        <hr/>
      </div>
      <div class="container">
        <a class="button" href="https://fake.business.biz/1"><div class="outer">Hero Gyros<p><span class="address" >1600 Grand Ave &smashp; 0.62 miles</span></p></div></a>
        <a class="button" href="https://fake.business.biz/2"><div class="outer">Russkaya Shaverma<p><span class="address" >900 University Ave &smashp; 0.06 miles</span></p></div></a>
        <a class="button" href="https://fake.business.biz/3"><div class="outer">Gyro Truck (food truck)<p>Could be anywhere :)</p></div></a>
      </div>`
      expect(ret.replace(/\s/g,'')).toEqual(expected.replace(/\s/g,''))
    })
  })

  describe('has no locs', () => {
    it ('retuns an empty string', () => {
      const ret = formatResults('{"locs":[]}')
      expect(ret).toEqual('<div>No results found within 40 km of you -- συγνώμη!</div>')
    })
  })

  describe('has no json', () => {
    it ('retuns an empty string', () => {
      const ret = formatResults('{}')
      expect(ret).toEqual('<div>No results found within 40 km of you -- συγνώμη!</div>')
    })
  })
})

describe('showLocations', () => {
  beforeEach(() => {
    const resultsElement = document.createElement('div')
    resultsElement.setAttribute('id', 'results')
    resultsElement.innerHTML = '(spinning gyro)'
    document.body.appendChild(resultsElement)
    expect(document.querySelector('#results').innerHTML).toEqual('(spinning gyro)')
  })

  it ('updates #results element', () => {
    const newHtml = '<div>New div</div>'
    showLocations(newHtml)
    expect(document.querySelector('#results').innerHTML).toEqual(newHtml)
  })
})

describe('locationError', () => {
  it ('displays error message', () => {
    const message = locationError({code: 2, message: 'bad things'})
    const expected = `
    <div class="gyro_error">
      <h1>We cannot find your gyros because we are unable to get your location from your browser :(. Please enable location sharing.</h1>
      <p>bad things</p>
      <p>error code: 2</p>
      </div>`
    expect(message.replace(/\s/g,'')).toEqual(
      expected.replace(/\s/g,''))
  })
})

describe('metersToMiles', () => {
  it ('converts properly', () => {
    expect(metersToMiles(5000)).toEqual('3.11')
  })
})

