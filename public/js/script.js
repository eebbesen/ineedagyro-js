export function formatResults(json) {
  if (json.locs && json.locs.length > 0) {
    const header = `
    <div class="results-header">
      <em>Results from Yelp!</em><hr/>
    </div>`;

    const recs = `
    <div class="container">
      ${json.locs.map((loc) => `<a class="button" href="${loc.url}"><div class="outer">${loc.name} ${formatGeoInfo(loc)}</div></a>`).join('')}
    </div>`;
    return header + recs;
  }

  return '<div>No results found within 40 km of you -- συγνώμη!</div>';
}

export function formatGeoInfo(loc) {
  let str = '';
  if (loc.location.address1) {
    let distance = loc.distance ? loc.distance : 0;
    str += `
    <div class="address" ><span class="lefty">${loc.location.address1}</span><span class="righty">${metersToMiles(distance)} miles</span></div>
    `;
  } else {
    str +=
      '<div class="address" ><span class="lefty">food truck</span><span class="righty">Could be anywhere :)</span></div>';
  }
  return str;
}

export function locationError(err) {
  console.log('Error getting location', err);
  let message = `
  <div class="gyro_error">
    <h1>We cannot find your gyros because we are unable to get your location from your browser :(. Please enable location sharing.</h1>
    <p>${err.message}</p>
  `;
  if (err.code) {
    message += `<p>error code: ${err.code}</p>`;
  }

  return `${message}</div>`;
}

export function populateResults() {
  navigator.geolocation.getCurrentPosition(
    function (location) {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const json = JSON.parse(xhr.response);
        const html = formatResults(json);

        return (document.querySelector('#results').innerHTML = html);
      };
      xhr.open(
        'GET',
        window.location +
          'recs?lat=' +
          location.coords.latitude +
          '&lng=' +
          location.coords.longitude,
      );
      xhr.send();
    },
    function (err) {
      return (document.querySelector('#results').innerHTML =
        locationError(err));
    },
  );
}

export function metersToMiles(meters) {
  return (meters * 0.000621371).toFixed(2);
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    populateResults();
  });
}
