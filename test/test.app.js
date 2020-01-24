const app = require('../app');
const expect = require('chai').expect;
const supertest = require('supertest');

const appList = require('../appList');

describe('GET /apps', () => {
  it('Should return a json array', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });

  it('Should contain the entire database unfiltered', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then (res => {
        expect(res.body).to.eql(appList);
      });
  });
});

describe('GET /apps with querios (the hot new query cereal)', () => {
  it('Should correctly sort by Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body[0].Rating).to.be.lessThan(res.body[19].Rating);
        expect(res.body[19].Rating).to.be.greaterThan(res.body[10].Rating);
      });
  });

  it('Should correctly sort by App', () => {
    let expectedSort = appList.sort((a, b) => {
      return a.App > b.App ? 1 : a.App < b.App ? -1 : 0;
    });
    
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.eql(expectedSort);
        
      });
  });

  it('Should correctly filter by genres', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Puzzle' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let mapped = res.body.map(obj => obj.Genres);
        expect(mapped).to.not.include.members(['Strategy', 'Action', 'Casual']);
        
      });
  });
});