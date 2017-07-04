
function formatResults(results) {
  var str = ''
  const json = JSON.parse(results)
  if (json.locs && json.locs.length > 0) {
    json.locs.map((loc) => {
      str += '<div class="record"><a href="'
          +  loc.url + '">' + loc.name + '</a> '
          +  loc.location.address1 + '</div>'
    })
  } else {
    str = '<div>No results found near you -- συγνώμη!</div>'
  }

  return str
}

function showLocations(html) {
  document.querySelector('#results').innerHTML = html
}

function populateResults() {
  navigator.geolocation.getCurrentPosition(function(location) {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      const html = formatResults(xhr.response)
      showLocations(html)
    }
    xhr.open("GET", window.location + 'recs?lat=' + location.coords.latitude + '&lng=' + location.coords.longitude)
    xhr.send()
  })
}
