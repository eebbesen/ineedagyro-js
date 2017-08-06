describe('formatResults', () => {
  describe('has records', () => {
    const json = {"locs":[
                   {"url":"https://fake.business.biz/1","name":"Hero Gyros","location":{"address1":"1600 Grand Ave"},"distance":1003.12},
                   {"url":"https://fake.business.biz/2","name":"Russkaya Shaverma","location":{"address1":"900 University Ave"},"distance":88.67},
                   {"url":"https://fake.business.biz/3","name":"Gyro Truck","location":{"address1":""},"distance":""}
                  ]}

    it ('retuns a string of results', () => {
      const ret = formatResults(json)
      expect(ret).toEqual('<em>Results from Yelp!</em><hr/><h3>Here are gyros for you:</h3>'
                        + '<div class="record"><a href="https://fake.business.biz/1">Hero Gyros</a> 1600 Grand Ave (1003 meters)</div>'
                        + '<div class="record"><a href="https://fake.business.biz/2">Russkaya Shaverma</a> 900 University Ave (88 meters)</div>'
                        + '<div class="record"><a href="https://fake.business.biz/3">Gyro Truck</a> (food truck)</div>')
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