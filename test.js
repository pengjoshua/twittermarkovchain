const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const mocha = require('mocha');
const app = require('./server/app');
const PORT = 3001;

chai.use(require('chai-things'));
chai.use(chaiHttp);

describe('Twitter Markov Chain App', () => {
  let server;
  beforeEach((done) => {
    server = app.listen(PORT, () => {
      // console.log(`Test server is listening on port ${PORT}!`);
      done();
    });
  });
  afterEach(() => {
    server.close();
  });

  describe('retrieve tweets from Twitter API', () => {

    it('should return 5 tweets from the Twitter API', (done) => {
      chai.request(app)
      .get('/brandlesslife/5')
      .end((err, res) => {
        res.body.forEach(tweet => console.log(tweet.text));
        expect(res.body.length).to.equal(5);
        done();
      });
    });

    it('should return 5 Brandless tweets from the Twitter API', (done) => {
      chai.request(app)
      .get('/brandlesslife/5')
      .end((err, res) => {
        let usernames = res.body.map(tweet => console.log(tweet.user.name));
        let allBrandless = res.body.reduce((a, tweet, i) => (tweet.user.name === 'Brandless'), false);
        expect(allBrandless).to.equal(true);
        done();
      });
    });

  });

});
