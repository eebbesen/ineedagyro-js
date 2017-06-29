describe('formatResults', () => {
  describe('has records', () => {
    const jsonString = '{"locs":['
                       + '{"url":"https://fake.business.biz/1","name":"Hero Gyros","location":{"address1":"1600 Grand Ave"}},'
                       + '{"url":"https://fake.business.biz/2","name":"Russkaya Shaverma","location":{"address1":"900 University Ave"}}'
                     + ']}'

    it ('retuns a string of results', () => {
      const ret = formatResults(jsonString)
      expect(ret).toEqual('<div class="record"><a href="https://fake.business.biz/1">Hero Gyros</a> 1600 Grand Ave</div>'
                        + '<div class="record"><a href="https://fake.business.biz/2">Russkaya Shaverma</a> 900 University Ave</div>')
    })
  })

  describe('has no locs', () => {
    it ('retuns an empty string', () => {
      const ret = formatResults('{"locs":[]}')
      expect(ret).toEqual('')
    })
  })

  describe('has no json', () => {
    it ('retuns an empty string', () => {
      const ret = formatResults('{}')
      expect(ret).toEqual('')
    })
  })
})

describe('showLocations', () => {
  beforeEach(() => {
    const resultsElement = document.createElement('div')
    resultsElement.setAttribute('id', 'results')
    resultsElement.innerHTML = 'Loading...'
    document.body.appendChild(resultsElement)
    expect(document.querySelector('#results').innerHTML).toEqual('Loading...')
  })

  it('updates #results element', () => {
    const newHtml = '<div>New div</div>'
    showLocations(newHtml)
    expect(document.querySelector('#results').innerHTML).toEqual(newHtml)
  })
})