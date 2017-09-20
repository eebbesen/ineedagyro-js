describe('formatResults', () => {
  describe('has records', () => {
    const json = {"locs":[
                   {"url":"https://fake.business.biz/1","name":"Hero Gyros","location":{"address1":"1600 Grand Ave"},"distance":1003.12},
                   {"url":"https://fake.business.biz/2","name":"Russkaya Shaverma","location":{"address1":"900 University Ave"},"distance":88.67},
                   {"url":"https://fake.business.biz/3","name":"Gyro Truck","location":{"address1":""},"distance":""}
                  ]}

    it ('retuns a string of results', () => {
      const ret = formatResults(json)
      expect(ret).toEqual('<div class="results-header"><em>Results from Yelp!</em><hr/><h3>Here are gyros for you:</h3></div>'
                        + '<div class="container">'
                        + '<a class="button" href="https://fake.business.biz/1"><div class="outer">Hero Gyros&nbsp;&nbsp;(1003 meters)<p><span class="address" >1600 Grand Ave</span></p></div></a>'
                        + '<a class="button" href="https://fake.business.biz/2"><div class="outer">Russkaya Shaverma&nbsp;&nbsp;(88 meters)<p><span class="address" >900 University Ave</span></p></div></a>'
                        + '<a class="button" href="https://fake.business.biz/3"><div class="outer">Gyro Truck (food truck)</div></a>'
                        + '</div>')
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

  it('updates #results element', () => {
    const newHtml = '<div>New div</div>'
    showLocations(newHtml)
    expect(document.querySelector('#results').innerHTML).toEqual(newHtml)
  })
})