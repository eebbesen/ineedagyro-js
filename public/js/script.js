function formatResults(json) {
  var str = ''
  if (json.locs && json.locs.length > 0) {
    str +='<div class="results-header">'
        +   '<em>Results from Yelp!</em><hr/>'
        +   '<h3>Here are gyros for you:</h3>'
        + '</div>'

    str += '<div class="container">'
    json.locs.map((loc) => {
      str += '<a class="button" href="'
          +  loc.url + '"><div class="outer">' + loc.name
          +  formatGeoInfo(loc)
          + '</div></a>'
    })
    str += '</div>'
  } else {
    str = '<div>No results found within 40 km of you -- συγνώμη!</div>'
  }

  return str
}

function formatGeoInfo(loc) {
  var str = ''
  if (loc.location.address1) {
    var distance = loc.distance ? Math.round(parseInt(loc.distance)) : 0
    str += '&nbsp;&nbsp;(' + distance + ' meters)'
    str += '<p><span class="address" >' + loc.location.address1 + '</span></p>'
  } else {
    str = ' (food truck)'
  }
  return str
}

function showLocations(html) {
  document.querySelector('#results').innerHTML = html
}

function locationError(err) {
  console.log('Error getting location', err)
  var message = '<div class="gyro_error">'
  message += '<h1>We cannot find your gyros because we are unable to get your location from your browser :(. Please enable location sharing.</h1>'
  message += '<p>' + err.message + '</p>'
  if(err.code) {
    message += '<p>error code: ' + err.code + '</p>'
  }
  message += '</div>'
  return message
}

function populateResults(c) {
  navigator.geolocation.getCurrentPosition(
    function(location) {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        const json = JSON.parse(xhr.response)
        const html = formatResults(json)

        return showLocations(html)
      }
      xhr.open("GET", window.location + 'recs?lat=' + location.coords.latitude + '&lng=' + location.coords.longitude)
      xhr.send()
    },
    function(err) {
      return showLocations(locationError(err))
    }
  )
}
