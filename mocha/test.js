const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const mocha = require('mocha');
const app = require('../server/app');
const PORT = 3001;
const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyDij-fNsRWMbfXKGenFqqHERnxE64tDqSI",
  authDomain: "twittermarkovchain.firebaseapp.com",
  databaseURL: "https://twittermarkovchain.firebaseio.com",
  projectId: "twittermarkovchain",
  storageBucket: "twittermarkovchain.appspot.com",
  messagingSenderId: "916418097451"
};
firebase.initializeApp(config);
const fbRef = firebase.database().ref();

chai.use(require('chai-things'));
chai.use(chaiHttp);

const clearDB = done => {
  fbRef.child('users').remove();
  done();
};

describe('Twitter Markov Chain API', () => {
  let server;
  // before(done => {
  //   clearDB(done);
  // });
  beforeEach(done => {
    server = app.listen(PORT, () => {
      // console.log(`Test server is listening on port ${PORT}!`);
      done();
    });
  });
  afterEach(() => {
    server.close();
  });

  describe('GET /:name/:count - retrieve tweets from Twitter API', () => {
    it('should return 5 tweets from the Twitter API', (done) => {
      chai.request(app)
      .get('/brandlesslife/5')
      .end((err, res) => {
        // res.body.forEach(tweet => console.log(tweet.text));
        res.should.have.status(200);
        expect(res.body.length).to.equal(5);
        done();
      });
    });

    it('should return 5 Brandless tweets from the Twitter API', (done) => {
      chai.request(app)
      .get('/brandlesslife/5')
      .end((err, res) => {
        // let usernames = res.body.map(tweet => console.log(tweet.user.name));
        let allBrandless = res.body.reduce((a, tweet, i) => (tweet.user.name === 'Brandless'), false);
        res.should.have.status(200);
        expect(allBrandless).to.equal(true);
        done();
      });
    });

    it('should return 10 Brandless tweets from the Twitter API', (done) => {
      chai.request(app)
      .get('/brandlesslife/10')
      .end((err, res) => {
        // let usernames = res.body.map(tweet => console.log(tweet.user.name));
        let allBrandless = res.body.reduce((a, tweet, i) => (tweet.user.name === 'Brandless'), false);
        res.should.have.status(200);
        expect(allBrandless).to.equal(true);
        done();
      });
    });

    it('should return 15 Brandless tweets from the Twitter API', (done) => {
      chai.request(app)
      .get('/brandlesslife/15')
      .end((err, res) => {
        // let usernames = res.body.map(tweet => console.log(tweet.user.name));
        let allBrandless = res.body.reduce((a, tweet, i) => (tweet.user.name === 'Brandless'), false);
        res.should.have.status(200);
        expect(allBrandless).to.equal(true);
        done();
      });
    });
  });

  describe('POST /signup - create a new account', () => {
    it('should successfully sign up a randomly generated new user', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randEmail = `${randName}@email.com`;
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: randEmail, password: randPassword, password2: randPassword })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.msg).to.equal('success');
        expect(res.body.displayName).to.equal(randName);
        done();
      });
    });

    it('should prevent the creation of a new user with an invalid email', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: randName, password: randPassword, password2: randPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent the creation of a new user without an email', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: '', password: randPassword, password2: randPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent the creation of a new user without a password', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: '', password: '', password2: '' })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent the creation of a new user when passwords do not match', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: '', password: randPassword, password2: 'test123' })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent the creation of a new user when passwords are less than 6 characters long', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: '', password: randPassword, password2: randPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent the creation of a new user when passwords are more than 20 characters long', (done) => {
      const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
      const randPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 22);
      chai.request(app)
      .post('/signup')
      .send({ displayName: randName, email: '', password: randPassword, password2: randPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });
  });

  describe('POST /login - log in to an existing account', () => {
    it('should successfully log in my previously created test user', (done) => {
      const testName = 'Test';
      const testPassword = 'test123';
      const testEmail = 'test@gmail.com';
      chai.request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.msg).to.equal('success');
        expect(res.body.displayName).to.equal(testName);
        done();
      });
    });

    it('should prevent logging in when the email is invalid', (done) => {
      const testName = 'Test';
      const testPassword = 'test123';
      const testEmail = 'testemailgmailcom';
      chai.request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent logging in when the email is empty', (done) => {
      const testName = 'Test';
      const testPassword = 'test123';
      const testEmail = '';
      chai.request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });

    it('should prevent logging in when the password is incorrect', (done) => {
      const testName = 'Test';
      const testPassword = 'test123456';
      const testEmail = '';
      chai.request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.msg).to.equal('invalid');
        done();
      });
    });
  });

  describe('GET /logout - log out of an existing account', () => {
    it('should successfully log in my previously created test user', (done) => {
      const testName = 'Test';
      const testPassword = 'test123';
      const testEmail = 'test@gmail.com';
      chai.request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        chai.request(app)
        .get('/logout')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.msg).to.equal('success');
          done();
        });
      });
    });
  });

  describe('POST /save - save one generated tweet', () => {
    it('should successfully save a tweet', (done) => {
      const tweet = {
        handle: 'hello',
        uid: 'hellouid',
        username: 'hellousername',
        text: 'hellotext',
        created_at: new Date()
      };
      chai.request(app)
      .post('/save')
      .send({ handle: tweet.handle, uid: tweet.uid, username: tweet.username, text: tweet.text, created_at: tweet.created_at })
      .end((err, res) => {
        res.should.have.status(200);
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(tweet));
        const savedId = res.body.id;
        done();
      });
    });
  });

  describe('GET /favorites - retrieve all saved tweets', () => {
    it('should successfully retrieve all tweets', (done) => {
      const testName = 'Test';
      const testPassword = 'test123';
      const testEmail = 'test@gmail.com';
      chai.request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        chai.request(app)
        .get('/favorites')
        .end((err, res) => {
          res.should.have.status(200);
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body.length).to.equal(3);
          done();
        });
      });
    });
  });

  describe('DELETE /delete - delete a tweet with its ID', () => {
    it('should successfully delete a tweet with its ID', (done) => {
      const tweet = {
        handle: 'hello',
        uid: 'hellouid',
        username: 'hellousername',
        text: 'hellotext',
        created_at: new Date()
      };
      chai.request(app)
      .post('/save')
      .send({ handle: tweet.handle, uid: tweet.uid, username: tweet.username, text: tweet.text, created_at: tweet.created_at })
      .end((err, res) => {
        chai.request(app)
        .delete('/delete/' + res.body.id)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.msg).to.equal('success');
          done();
        });
      });
    });
  });

});
