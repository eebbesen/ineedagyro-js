process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import * as script from '../../src/script.js';

describe('formatGeoInfo', () => {
  it('should format the location info correctly when address1', () => {
    const expected = '<div class="address" ><span class="lefty">1600 Grand Ave</span><span class="righty">0.62 miles</span></div>';
    const loc = {
      location: { address1: '1600 Grand Ave' },
      distance: 1003.12,
    };

    const result = script.formatGeoInfo(loc);

    expect(result).to.equal(expected);
  });

  it('should format the location info correctly when no distance', () => {
    const expected = '<div class="address" ><span class="lefty">1600 Grand Ave</span><span class="righty">0.00 miles</span></div>';
    const loc = {
      location: { address1: '1600 Grand Ave' },
    };

    const result = script.formatGeoInfo(loc);

    expect(result).to.equal(expected);
  });

  it('should format the location info correctly when no address1', () => {
    const expected = '<div class="address" ><span class="lefty">food truck</span><span class="righty">Could be anywhere :)</span></div>';
    const loc = {
      location: { address1: '' },
      distance: 1003.12,
    };

    const result = script.formatGeoInfo(loc);

    expect(result).to.equal(expected);
  });
});

describe('buildUrl', () => {
  it('should create a URL with base, lat, and lng', () => {
    const base = 'https://ineedagyro.com';
    const lat = 37.7749;
    const lng = -122.4194;

    const result = script.buildUrl(base, lat, lng);

    expect(result).to.equal('https://ineedagyro.com/recs?lat=37.7749&lng=-122.4194');
  });

  it('should add the term parameter when provided', () => {
    const base = 'https://ineedagyro.com';
    const lat = 37.7749;
    const lng = -122.4194;
    const term = 'gyro';

    const result = script.buildUrl(base, lat, lng, term);

    expect(result).to.equal('https://ineedagyro.com/recs?lat=37.7749&lng=-122.4194&term=gyro');
  });

  it('should handle special characters in term parameter', () => {
    const base = 'https://ineedagyro.com';
    const lat = 37.7749;
    const lng = -122.4194;
    const term = 'greek gyro & falafel';

    // Note: The buildUrl function doesn't encode the term, so our test reflects this
    // In a real application, you might want to encode the term with encodeURIComponent()
    const result = script.buildUrl(base, lat, lng, term);

    expect(result).to.equal('https://ineedagyro.com/recs?lat=37.7749&lng=-122.4194&term=greek gyro & falafel');
  });

  it('should work with base URLs that already have paths', () => {
    const base = 'https://ineedagyro.com/api/v1';
    const lat = 37.7749;
    const lng = -122.4194;

    const result = script.buildUrl(base, lat, lng);

    expect(result).to.equal('https://ineedagyro.com/api/v1/recs?lat=37.7749&lng=-122.4194');
  });
});

describe('getParams', () => {
  it('returns an object with params', () => {
    const url = 'http://localhost:8080/?lat=44&lng=93&term=cheese%20steak';
    const expected = {
      lat: '44',
      lng: '93',
      term: 'cheese steak',
    };
    const ret = script.getParams(url);
    expect(ret).to.deep.equal(expected);
  });

  it('returns an object with no params', () => {
    const url = 'http://localhost:8080/';
    const expected = {};
    const ret = script.getParams(url);
    expect(ret).to.deep.equal(expected);
  });

  it('returns an object with empty params', () => {
    const url = 'http://localhost:8080/?';
    const expected = {};
    const ret = script.getParams(url);
    expect(ret).to.deep.equal(expected);
  });
});

describe('formatResults', () => {
  describe('has records', () => {
    const json = {
      locs: [
        {
          url: 'https://fake.business.biz/1',
          name: 'Hero Gyros',
          location: { address1: '1600 Grand Ave' },
          distance: 1003.12,
          is_closed: false,
        },
        {
          url: 'https://fake.business.biz/2',
          name: 'Russkaya Shaverma',
          location: { address1: '900 University Ave' },
          distance: 88.67,
          is_closed: false,
        },
        {
          url: 'https://fake.business.biz/3',
          name: 'Gyro Truck',
          location: { address1: '' },
          distance: '',
          is_closed: false,
        },
        {
          url: 'https://fake.business.biz/4',
          name: 'Gyronimus Bosch',
          location: { address1: 'Allianz Bank Center' },
          distance: '93.2',
          is_closed: true,
        },
      ],
    };

    it('retuns a string of results', () => {
      const ret = script.formatResults(json);
      const expected = `
      <div class="results-header">
        <em>Results from Yelp!</em>
        <hr/>
      </div>
      <div class="container">
        <a class="button" href="https://fake.business.biz/1"><div class="outer">Hero Gyros<div class="address"><span class="lefty">1600 Grand Ave</span><span class="righty">0.62 miles</span></div></div></a>
        <a class="button" href="https://fake.business.biz/2"><div class="outer">Russkaya Shaverma<div class="address"><span class="lefty">900 University Ave</span><span class="righty">0.06 miles</span></div></div></a>
      </div>`;
      expect(ret.replace(/\s/g, '')).to.equal(expected.replace(/\s/g, ''));
    });
  });

  describe('has no locs', () => {
    it('retuns an empty string', () => {
      const ret = script.formatResults('{"locs":[]}');
      expect(ret).to.equal(
        '<div>No results found within 40 km of you -- συγνώμη!</div>',
      );
    });
  });

  describe('has no json', () => {
    it('retuns an empty string', () => {
      const ret = script.formatResults('{}');
      expect(ret).to.equal(
        '<div>No results found within 40 km of you -- συγνώμη!</div>',
      );
    });
  });
});

describe('locationError', () => {
  it('displays error message', () => {
    const message = script.locationError({ code: 2, message: 'bad things' });
    const expected = `
    <div class="gyro_error">
      <h1>We cannot find your gyros because we are unable to get your location from your browser :(. Please enable location sharing.</h1>
      <p>bad things</p>
      <p>error code: 2</p>
      </div>`;
    expect(message.replace(/\s/g, '')).to.equal(expected.replace(/\s/g, ''));
  });
});

describe('metersToMiles', () => {
  it('converts properly', () => {
    expect(script.metersToMiles(5000)).to.equal('3.11');
  });
});
