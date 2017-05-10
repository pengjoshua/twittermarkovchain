const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const Promise = require('bluebird');
const Twitter = require('twitter');
const path = require('path');
const cors = require('cors');
const firebase = require('firebase');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(cookieParser());

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Twitter Config
const client = new Twitter({
  consumer_key: '2XiHjHTGpZ9xSS8CGxj3DJZHe',
  consumer_secret: 'WqzkKhBsBAdHfPHy09XDQoHVzOdreiLRs1pPUpP5fCDYQlrwGw',
  access_token_key: '1639459152-DSGj1DaIzL6CmnlyTvK6F5QB0yyMXVizxKSUVFX',
  access_token_secret: 'oRmkJZGqRPFUdzJWzkNDbbbiYNnclcxjNZkkw5g16p18e'
});
Promise.promisifyAll(client);

// Firebase Config
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

// Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.authdata = firebase.auth().currentUser;
  res.locals.page = req.url;
  next();
});

// Get User Info
app.get('*', (req, res, next) => {
  if (firebase.auth().currentUser !== null) {
    const userRef = fbRef.child('users');
    userRef.orderByChild('uid').startAt(firebase.auth().currentUser.uid).endAt(firebase.auth().currentUser.uid).on('child_added', (snapshot) => {
      res.locals.user = snapshot.val();
    });
  }
  next();
});

// Fetch Tweets by Twitter Username
app.get('/:name/:count', (req, res) => {
  client.getAsync('statuses/user_timeline', { screen_name: req.params.name, count: req.params.count })
  .then(tweets => {
    res.send(tweets);
  })
  .catch(error => {
    console.log(error);
  });
});

// Sign Up New User
app.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  const displayName = req.body.displayName;

	req.checkBody('displayName', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.assert('password', '6 to 20 characters required').len(6, 20);

	let errors = req.validationErrors();
  if (errors) {
    console.log('Error creating user: ', errors);
    return res.send({ msg: 'invalid', displayName: displayName, errors: errors });
	} else {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
  		console.log('Error creating user: ', error);
      return res.send({ msg: 'error', displayName: displayName, error: error });
  	}).then((userData) => {
      if (res.headersSent) return;
  		console.log('Successfully created user with uid: ', userData.uid);

  		let currentUser = {
  			uid: userData.uid,
  			email: email,
  			displayName: displayName,
  		};

  		const userRef = fbRef.child('users');
  		userRef.push().set(currentUser);
      req.flash('success_msg', 'You are now registered and can login');
      res.send({ msg: 'success', displayName: displayName, uid: userData.uid });
  	});
  }
});

// Log In User
app.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	let errors = req.validationErrors();

	if (errors) {
    console.log('Error creating user: ', errors);
    return res.send({ msg: 'invalid', errors: errors });
	} else {
		firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
			console.log('Login Failed: ', error);
			req.flash('error_msg', 'Login Failed');
      return res.send({ msg: 'error' });
		}).then((authData) => {
      if (res.headersSent) return;
			req.flash('success_msg', 'You are now logged in');
      const userRef = fbRef.child('users');
      userRef.once('value', (snapshot) => {
    		let users = [];
    		snapshot.forEach((childSnapshot) => {
    			let key = childSnapshot.key;
    			let childData = childSnapshot.val();
    			if (childData.uid === firebase.auth().currentUser.uid) {
    				users.push({
    					id: key,
    					displayName: childData.displayName,
              email: childData.email,
              uid: childData.uid
    				});
    			}
    		});
        res.send(Object.assign({ msg: 'success' }, users[0]));
    	});
    });
	}
});

// Log Out User
app.get('/logout', (req, res) => {
  const displayName = req.body.displayName;
	firebase.auth().signOut().then(() => {
    req.flash('success_msg', 'You are logged out');
    res.send({ msg: 'success', displayName: displayName });
  });
});

// Save Favorite Generated Tweets
app.post('/save', (req, res) => {
  const tweetRef = fbRef.child('tweets');

  const tweet = {
    uid: req.body.uid,
    username: req.body.username,
    text: req.body.text,
    created_at: req.body.created_at
  };

  tweetRef.push().set(tweet);
  req.flash('success_msg', 'Tweet Saved');
  res.send(tweet);
});

// Retrieve Your Favorite Tweets
app.get('/favorites', (req, res) => {
  const tweetRef = fbRef.child('tweets');

	tweetRef.once('value', (snapshot) => {
		let tweets = [];
		snapshot.forEach((childSnapshot) => {
			let key = childSnapshot.key;
			let childData = childSnapshot.val();
			if (childData.uid === firebase.auth().currentUser.uid) {
				tweets.push({
					id: key,
					username: childData.username,
          text: childData.text,
          created_at: childData.created_at,
          uid: childData.uid
				});
			}
		});
		res.send(tweets);
	});
});

// Delete A Favorite Tweet
app.delete('/delete/:id', (req, res) => {
	const id = req.params.id;
	const tweetRef = firebase.database().ref('/tweets/' + id);

	tweetRef.remove();

	req.flash('success_msg', 'Tweet Deleted');
	res.send({ msg: 'success' });
});

module.exports = app;
