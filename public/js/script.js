
function formatResults(results) {
  const json = JSON.parse(results)
  var str = ''
  json.locs.map((loc) => {
    str += '<div class="record"><a href="'+ loc.url + '">' + loc.name + '</a> ' + loc.location.address1 + '</div>'
  })

  document.querySelector('#results').innerHTML = str
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(function(location) {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      formatResults(xhr.response)
    }
    xhr.open("GET", window.location + 'recs?lat=' + location.coords.latitude + '&lng=' + location.coords.longitude)
    xhr.send()
  })
}
