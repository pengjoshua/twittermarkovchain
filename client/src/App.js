import React, { Component } from 'react';
import { Grid, Row, Col, Button, FormGroup } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Tweets from './components/Tweets';
import axios from 'axios';
import titles from './titles';
import '../public/style.css';

const minLength = 4 + Math.floor(4 * Math.random());
const count = 18;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titles: titles,
      username: '',
      tweets: [],
      text: [],
      tweet: '',
      count: count
    };
    this.terminals = {};
    this.startWords = [];
    this.wordStats = {};
  }

  getTweets(username, count) {
    axios.get('/' + username + '/' + count)
    .then(res => {
      this.terminals = {};
      this.startWords = [];
      this.wordStats = {};
      let text = res.data.map(tweet => tweet.text);
      this.setState({ tweets: res.data, text: text, username: username }, () => {
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

  componentDidMount() {
    this.getTweets('brandlesslife', count);
  }

  choice(array) {
    const i = Math.floor(array.length * Math.random());
    return array[i];
  }

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

  displayTweet() {
    let tweet = this.makeTweet(minLength);
    this.setState({ tweet: tweet });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.refs.name.value === '') {
      alert('Twitter username is required');
    }
    let usercount = (this.refs.count.value !== '') ? this.refs.count.value : count;
    this.setState({ username: this.refs.name.value, count: usercount }, () => {
      this.getTweets(this.state.username, this.state.count);
    });
    this.refs.name.value = '';
    this.refs.count.value = '';
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Grid>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <h5 className="subtitle">Generate Markov chains based on user tweets!</h5>
              <form onSubmit={this.handleSubmit.bind(this)}>
                <FormGroup>
                  <input
                    className="form-control"
                    type="text"
                    ref="name"
                    placeholder="Enter Twitter username (i.e. brandlesslife)"
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    className="form-control"
                    type="number"
                    ref="count"
                    placeholder={"Enter tweet amount (" + count + " if left blank, 18 max)"}
                  />
                </FormGroup>
                <Button type='submit'>Submit</Button>
              </form>
              <br />
              <h5 className="tweet">{this.state.tweet}</h5>
              <Tweets tweets={this.state.tweets} count={this.state.count} username={this.state.username} />
              <div className="bottom"></div>
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default App;
