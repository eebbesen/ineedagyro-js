process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app.js';
import Yelp from 'yelp-fusion';
import { buildRequest, gitSha } from '../../routes/index.js';

const agent = supertest(app);

import sinon from 'sinon';
let sandbox;
let stub;

describe('gitSha', function () {
  it('should return SOURCE_VERSION', () => {
    process.env.SOURCE_VERSION = '1234567890abcdef1234567890abcdef12345678';
    const result = gitSha();
    expect(result).to.equal('1234567890abcdef1234567890abcdef12345678');
  });

  it('should return sha from exec', () => {
    const result = gitSha();
    expect(result).to.match(/^[0-9a-f]{40}$/);
  });
});

describe('buldRequest', function () {
  it('should build a request with lat and lng', () => {
    const req = {
      query: {
        lat: 44,
        lng: 93,
      },
    };
    const result = buildRequest(req);
    expect(result).to.deep.equal({
      term: 'gyro',
      latitude: 44,
      longitude: 93,
      sort_by: 'distance',
    });
  });

  it('should build a request with passed-in term', () => {
    const req = {
      query: {
        lat: 44,
        lng: 93,
        term: 'cheese steak',
      },
    };

    const result = buildRequest(req);
    expect(result).to.deep.equal({
      term: 'cheese steak',
      latitude: 44,
      longitude: 93,
      sort_by: 'distance',
    });
  });
});

describe('router', function () {
  beforeEach(function () {
    sandbox = sinon.createSandbox();
    stub = sandbox.stub(Yelp, 'client');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should render index at /', (done) => {
    agent.get('/').end(function (err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('open_gyro_outline_500.jpeg');

      done();
    });
  });

  it('should render index at /recs with locs', (done) => {
    stub.returns({
      search: function () {
        return new Promise(function (resolve) {
          resolve({
            jsonBody: {
              businesses: [
                {
                  url: 'https://fakestaurant.com/1',
                  name: 'Gyro Hero',
                  location: {
                    address1: '1600 Grand Ave',
                  },
                },
              ],
            },
          });
        });
      },
    });

    agent
      .get('/recs')
      .query({ lat: 44, lng: 93 })
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.contain('Hero');
        expect(stub.called).to.equal(true);

        done();
      });
  });

  it('should render index at /recs with nothing', (done) => {
    stub.returns({
      search: function () {
        return new Promise(function (resolve) {
          resolve({ jsonBody: { businesses: [{}] } });
        });
      },
    });

    agent
      .get('/recs')
      .query({ lat: 44, lng: 93 })
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('{"locs":[{}]}');
        expect(stub.called).to.equal(true);

        done();
      });
  });

  it('should render privacy policy at /privacy', (done) => {
    agent.get('/privacy').end(function (err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('this gyro service');

      done();
    });
  });
});
