import React, { Component } from 'react';
import { Grid, Row, Col, Button, FormGroup } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Tweets from './components/Tweets';
import Favorites from './components/Favorites';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import titles from './titles';
import '../public/style.css';
import javascript_time_ago from 'javascript-time-ago';
javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');
const timeAgo = new javascript_time_ago('en-US');
// const twitter = timeAgo.style.twitter();

// Constants for default values
const minLength = 4 + Math.floor(4 * Math.random());
const count = 18;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      handle: '',
      tweets: [],
      text: [],
      tweet: {
        uid: '',
        username: '',
        handle: '',
        text: '',
        created_at: '',
        id: ''
      },
      deleteTweet: {
        uid: '',
        handle: '',
        username: '',
        text: '',
        created_at: '',
        id: ''
      },
      count: count,
      message: '',
      loggedIn: false,
      clickedSignup: false,
      clickedSave: false,
      user: {
        uid: '',
        displayName: '',
        email: ''
      },
      favorites: [],
    };
    this.terminals = {};
    this.startWords = [];
    this.wordStats = {};
  }

  // get 18 tweets from @brandlesslife to start
  componentDidMount() {
    this.getTweets('brandlesslife', count);
  }

  // get tweets from Twitter API
  getTweets(handle, count) {
    axios.get('/' + handle + '/' + count)
    .then(res => {
      this.terminals = {};
      this.startWords = [];
      this.wordStats = {};
      let text = res.data.map(tweet => tweet.text);
      this.setState({
        tweets: res.data,
        text: text,
        username: res.data[0].user.name,
        handle: handle
      }, () => {
        for (let i = 0; i < this.state.text.length; i++) {
          let words = this.state.text[i].split(' ');
          this.terminals[words[words.length - 1]] = true;
          this.startWords.push(words[0]);
          for (let j = 0; j < words.length - 1; j++) {
            if (this.wordStats[words[j]]) this.wordStats[words[j]].push(words[j + 1]);
            else this.wordStats[words[j]] = [words[j + 1]];
          }
        }
        this.displayTweet();
      });
    });
  }

  // Return random array index
  choice(array) {
    const i = Math.floor(array.length * Math.random());
    return array[i];
  }

  // Making the Markov chain (tweet) with a recursive call
  makeTweet(minLength) {
    let word = this.choice(this.startWords);
    let tweet = [word];
    while (this.wordStats[word]) {
        let nextWords = this.wordStats[word];
        word = this.choice(nextWords);
        tweet.push(word);
        if (tweet.length > minLength && this.terminals[word]) break;
    }
    if (tweet.length < minLength) return this.makeTweet(minLength);
    return tweet.join(' ');
  }

  // Display the generated tweet
  displayTweet() {
    let text = this.makeTweet(minLength);
    this.setState({
      tweet: {
        uid: this.state.user.uid,
        username: this.state.username,
        handle: this.state.handle,
        text: text,
        created_at: new Date()
      },
    });
  }

  // Handling the 'generate' button submit
  // Get tweets from Twitter API and passes the Twitter handle and count
  handleGenerateSubmit(e) {
    e.preventDefault();
    if (this.refs.handle.value === '') alert('Twitter username is required');
    let usercount = (this.refs.count.value === '' || this.refs.count.value > 18) ? count : this.refs.count.value;
    this.setState({ handle: this.refs.handle.value, count: usercount, clickedSave: false }, () => {
      this.getTweets(this.state.handle, this.state.count);
    });
    this.refs.handle.value = '';
    this.refs.count.value = '';
  }

  // Handling signup and signup button visibility
  // API call to POST /signup passing in the displayName, password, password2, and email
  handleSignupSubmit(e) {
    e.preventDefault();
    let preventSignup = false;
    if (this.refs.displayName.value === '') preventSignup = true;
    if (this.refs.password.value === '' || this.refs.password.value.length < 6) preventSignup = true;
    if (this.refs.password2.value === '' || this.refs.password2.value.length < 6) preventSignup = true;
    if (this.refs.email.value === '') preventSignup = true;

    if (!preventSignup) {
      axios.post('/signup', {
        displayName: this.refs.displayName.value,
        password: this.refs.password.value,
        password2: this.refs.password2.value,
        email: this.refs.email.value,
      })
      .then(res => {
        if (res.data.msg !== 'success') {
          this.setState({
            loggedIn: false,
            clickedSignup: true,
            message: `Sorry ${res.data.displayName}, we could not create a new account for you.`
          });
          console.log(res.data.errors ? res.data.errors : res.data.error);
        } else {
          let tweet = Object.assign({}, this.state.tweet);
          tweet.uid = res.data.uid;
          this.setState({
            loggedIn: true,
            clickedSignup: false,
            message: `Congrats ${res.data.displayName}, you are now signed up and logged in!`,
            user: {
              uid: res.data.uid,
              displayName: res.data.displayName,
              email: res.data.email,
            },
            tweet: tweet
          });
        }
      })
      .catch(err => console.log(err));
      this.refs.displayName.value = '';
      this.refs.password.value = '';
      this.refs.password2.value = '';
      this.refs.email.value = '';
    }
  }

  // Handling login and login button visibility
  // API call to POST /login passing in the email and password
  handleLoginSubmit(e) {
    e.preventDefault();
    let preventLogin = false;
    if (this.refs.password.value === '' || this.refs.password.value.length < 6) preventLogin = true;
    if (this.refs.email.value === '') preventLogin = true;

    if (!preventLogin) {
      axios.post('/login', {
        password: this.refs.password.value,
        email: this.refs.email.value,
      })
      .then(res => {
        if (res.data.msg !== 'success') {
          this.setState({
            loggedIn: false,
            clickedSignup: false,
            message: `Sorry, we could not log you in.`
          });
        } else {
          let tweet = Object.assign({}, this.state.tweet);
          tweet.uid = res.data.uid;
          this.setState({
            loggedIn: true,
            clickedSignup: false,
            message: `Thanks ${res.data.displayName}, you are now logged in!`,
            user: {
              uid: res.data.uid,
              displayName: res.data.displayName,
              email: res.data.email,
            },
            tweet: tweet,
          });
          this.getFavorites();
        }
      })
      .catch(err => console.log(err));
      this.refs.password.value = '';
      this.refs.email.value = '';
    }
  }

  // Click handlers for signup/login button visibility
  clickSignup() {
    this.setState({ clickedSignup: true });
  }

  clickLogin() {
    this.setState({ clickedSignup: false });
  }

  clickLogout() {
    this.setState({ loggedIn: false }, () => {
      axios.post('/logout', { displayName: this.state.user.displayName })
      .then(res => {
        this.setState({ clickedSignup: false, loggedIn: false });
      })
      .catch(err => console.log(err));
    });
  }

  // API call to POST /favorites to save a generated tweet
  // Passes in uid (user id associated with the generated tweet),
  // handle (i.e. @brandlesslife), username (Brandless), text, and created_at timestamp
  saveTweet() {
    axios.post('/favorites', {
      uid: this.state.tweet.uid,
      handle: this.state.tweet.handle,
      username: this.state.tweet.username,
      text: this.state.tweet.text,
      created_at: this.state.tweet.created_at
    })
    .then(res => {
      this.setState({ clickedSave: true });
      this.getFavorites();
    })
    .catch(err => console.log(err));
  }

  // API call to GET /favorites to retrieve all tweets
  // the tweets are later filtered according to the user that they are assigned to using the tweet uid
  getFavorites() {
    axios.get('/favorites')
    .then(res => {
      console.log('tweets', res.data);
      this.setState({ favorites: res.data });
    })
    .catch(err => console.log(err));
  }

  // Handling a favorite tweet delete button click
  // API call to DELETE /favorites passing the tweet id
  deleteTweet(tweet) {
    this.setState({
      deleteTweet: {
        uid: tweet.uid,
        handle: tweet.handle,
        username: tweet.username,
        text: tweet.text,
        created_at: tweet.created_at,
        id: tweet.id
      }
    }, () => {
      axios.delete('/favorites/' + this.state.deleteTweet.id)
      .then(res => {
        this.getFavorites();
      })
      .catch(err => console.log(err));
    });
  }

  render() {
    // The top right userInfo section will be 1 of 3 possibilities:
    // 1. login form
    // 2. signup form
    // 3. 'You are logged in' notification
    let userInfo;
    if (!this.state.loggedIn && this.state.clickedSignup) {
      userInfo = (
        <div className="userInfo">
          <h5 className="user">Please fill in the following fields to sign up</h5>
          <form onSubmit={this.handleSignupSubmit.bind(this)}>
            <FormGroup>
              <input
                className="form-control signup-name"
                type="text"
                ref="displayName"
                placeholder="Enter your name"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control signup-email"
                type="text"
                ref="email"
                placeholder="Enter your email address"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control signup-password"
                type="password"
                ref="password"
                placeholder="Enter your password (between 6 to 20 characters)"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control signup-password2"
                type="password"
                ref="password2"
                placeholder="Confirm your password"
              />
            </FormGroup>
            <Button className="button-signup" bsStyle="info" type='submit'>
              <FontAwesome name="plus" />&nbsp;Sign Up
            </Button>
            &nbsp;&nbsp;
            <Button className="button" bsStyle="warning" type="button" onClick={this.clickLogin.bind(this)}>
              <FontAwesome name="reply" />&nbsp;Back
            </Button>
          </form>
        </div>
      );
    } else if (!this.state.loggedIn && !this.state.clickedSignup) {
      userInfo = (
        <div className="userInfo">
          <h5 className="user">Please log in to save generated Markov chains (tweets)</h5>
          <form onSubmit={this.handleLoginSubmit.bind(this)}>
            <FormGroup>
              <input
                className="form-control login-email"
                type="text"
                ref="email"
                placeholder="Enter your email address"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control login-password"
                type="password"
                ref="password"
                placeholder="Enter your password"
              />
            </FormGroup>
            <Button className="button-login" bsStyle="primary" type='submit'>
              <FontAwesome name="twitter-square" />&nbsp;Log In
            </Button>
            &nbsp;&nbsp;
            <Button className="button-register" bsStyle="info" type="button" onClick={this.clickSignup.bind(this)}>
              <FontAwesome name="plus-square" />&nbsp;Sign Up
            </Button>
          </form>
        </div>
      );
    } else {
      userInfo = (
        <div className="userInfo">
          <h5 className="user loggedin">You are logged in as {this.state.user.displayName}!</h5>
          <Button className="button-logout" bsStyle="danger" onClick={this.clickLogout.bind(this)}>
            <FontAwesome name="minus-square" />&nbsp;Log Out
          </Button>
        </div>
      );
    }

    return (
      <div className="App">
        <Header />
        <Grid>
          <Row>
            <Col className="container" xs={12} md={6} lg={6}>
              <div className="tweetInfo">
                <h5 className="subtitle">Generate Markov chains based on user tweets!</h5>
                <form onSubmit={this.handleGenerateSubmit.bind(this)}>
                  <FormGroup>
                    <input
                      className="form-control handle-generate"
                      type="text"
                      ref="handle"
                      placeholder="Enter Twitter handle (i.e. brandlesslife)"
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      className="form-control number-generate"
                      type="number"
                      ref="count"
                      placeholder={"Enter tweet amount (" + count + " if left blank, 18 max)"}
                    />
                  </FormGroup>
                  <Button className="button-generate" bsStyle="info" type='submit'>
                    <FontAwesome name="twitter" />&nbsp;Generate
                  </Button>
                </form>
              </div>
            </Col>
            <Col className="container" xs={12} md={6} lg={6}>
              {userInfo}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="container" xs={12} md={12} lg={12}>
              <div className="generated">
                <h4 className="subtitle">Generated Markov chain (tweet)!</h4>
                <span className="generatedtitle">
                  <h5 className="generatedtitle"><strong>{this.state.tweet.username}</strong> @{this.state.tweet.handle} <i>{timeAgo.format(new Date())}</i></h5>
                </span>
                <h5 className="generatedtext">{this.state.tweet.text}</h5>
                  { this.state.loggedIn ?
                  <Button className="button-save" bsStyle="info" onClick={this.saveTweet.bind(this)}>
                    <FontAwesome name="star" />&nbsp;Save
                  </Button> : ''
                  }
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="container" xs={12} md={6} lg={6}>
              <Tweets
                tweets={this.state.tweets}
                count={this.state.count}
                handle={this.state.handle}
                username={this.state.username}
              />
            </Col>
            <Col className="container" xs={12} md={6} lg={6}>
              {this.state.loggedIn ?
                <Favorites
                  tweets={this.state.favorites}
                  uid={this.state.user.uid}
                  id={this.state.deleteTweet.id}
                  onClick={this.deleteTweet.bind(this)}
                /> : ''
              }
            </Col>
          </Row>
          <div className="bottom"></div>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default App;
