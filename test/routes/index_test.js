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

describe('gitSha', () => {
  beforeEach(() => {
    process.env.HEROKU_BUILD_COMMIT = undefined;
  });

  it('should return HEROKU_BUILD_COMMIT', () => {
    process.env.HEROKU_BUILD_COMMIT = '1234567890abcdef1234567890abcdef12345678';
    const result = gitSha();
    expect(result).to.equal('1234567890abcdef1234567890abcdef12345678');
  });

  it('should return sha from exec', () => {
    const result = gitSha();
    expect(result).to.match(/^[0-9a-f]{40}$/);
    expect(result).not.to.equal('1234567890abcdef1234567890abcdef12345678');
  });
});

describe('buldRequest', () => {
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

describe('router', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stub = sandbox.stub(Yelp, 'client');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render version at /version', async () => {
    process.env.HEROKU_BUILD_COMMIT = '1234567890abcdef1234567890abcdef12345678';
    const res = await agent.get('/version');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('{"version":"1234567890abcdef1234567890abcdef12345678"}');
  });

  it('should render index at /', async () => {
    const res = await agent.get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.contain('open_gyro_outline_500.jpeg');
  });

  it('should render index at /recs with locs', async () => {
    stub.returns({
      search: () => Promise.resolve({
        jsonBody: {
          businesses: [
            {
              url: 'https://fakestaurant.com/1',
              name: 'Gyro Hero',
              location: { address1: '1600 Grand Ave' },
            },
          ],
        },
      }),
    });

    const res = await agent.get('/recs').query({ lat: 44, lng: 93 });
    expect(res.status).to.equal(200);
    expect(res.text).to.contain('Hero');
    expect(stub.called).to.equal(true);
  });

  it('should render index at /recs with nothing', async () => {
    stub.returns({
      search: () => Promise.resolve({ jsonBody: { businesses: [{}] } }),
    });

    const res = await agent.get('/recs').query({ lat: 44, lng: 93 });
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('{"locs":[{}]}');
    expect(stub.called).to.equal(true);
  });

  it('should render privacy policy at /privacy', async () => {
    const res = await agent.get('/privacy');
    expect(res.status).to.equal(200);
    expect(res.text).to.contain('this gyro service');
  });
});
