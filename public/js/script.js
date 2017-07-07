function formatResults(json) {
  var str = ''
  if (json.locs && json.locs.length > 0) {
    json.locs.map((loc) => {
      str += '<div class="record"><a href="'
          +  loc.url + '">' + loc.name + '</a> '
          +  formatGeoInfo(loc)
          + '</div>'
    })
  } else {
    str = '<div>No results found within 40 km of you -- συγνώμη!</div>'
  }

  return str
}

function formatGeoInfo(loc) {
  var str = ''
  if (loc.location.address1) {
    var distance = loc.distance ? Math.round(parseInt(loc.distance)) : 0
    str += loc.location.address1
    str += ' (' + distance + ' meters)'
  } else {
    str = '(food truck)'
  }
  return str
}

function showLocations(html) {
  document.querySelector('#results').innerHTML = html
}

function populateResults(c) {
  navigator.geolocation.getCurrentPosition(function(location) {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      const json = JSON.parse(xhr.response)
      const html = formatResults(json)

      return showLocations(html)
    }
    xhr.open("GET", window.location + 'recs?lat=' + location.coords.latitude + '&lng=' + location.coords.longitude)
    xhr.send()
  })
}
