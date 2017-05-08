import React, { Component } from 'react';
import { Grid, Row, Col, Button, FormGroup } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Tweets from './components/Tweets';
import axios from 'axios';
import titles from './titles';
import '../public/style.css';

const minLength = 5 + Math.floor(5 * Math.random());
const count = 25;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titles: titles,
      title: '',
      username: '',
      tweets: [],
      text: [],
      tweet: '',
      count: count
    };
    this.terminals = {};
    this.startWords = [];
    this.wordStats = {};
    this.terminals1 = {};
    this.startWords1 = [];
    this.wordStats1 = {};
  }

  getTweets(username, count) {
    axios.get('/' + username + '/' + count)
    .then(res => {
      let text = res.data.map(tweet => tweet.text);
      console.log(text);
      this.setState({ tweets: res.data, text: text, username: username }, () => {
        for (let i = 0; i < this.state.text.length; i++) {
          let words = this.state.text[i].split(' ');
          this.terminals1[words[words.length - 1]] = true;
          this.startWords1.push(words[0]);
          for (let j = 0; j < words.length - 1; j++) {
            if (this.wordStats1[words[j]]) this.wordStats1[words[j]].push(words[j + 1]);
            else this.wordStats1[words[j]] = [words[j + 1]];
          }
        }
        this.displayTweet();
      });
    });
  }

  componentDidMount() {
    // for (let i = 0; i < this.state.titles.length; i++) {
    //   let words = this.state.titles[i].split(' ');
    //   this.terminals[words[words.length - 1]] = true;
    //   this.startWords.push(words[0]);
    //   for (let j = 0; j < words.length - 1; j++) {
    //     if (this.wordStats[words[j]]) this.wordStats[words[j]].push(words[j + 1]);
    //     else this.wordStats[words[j]] = [words[j + 1]];
    //   }
    // }

    this.getTweets('brandlesslife', count);
  }

  choice(array) {
    const i = Math.floor(array.length * Math.random());
    return array[i];
  }

  makeTitle(minLength) {
    let word = this.choice(this.startWords);
    let title = [word];
    while (this.wordStats[word]) {
        let nextWords = this.wordStats[word];
        word = this.choice(nextWords);
        title.push(word);
        if (title.length > minLength && this.terminals[word]) break;
    }
    if (title.length < minLength) return this.makeTitle(minLength);
    return title.join(' ');
  }

  makeTweet(minLength) {
    let word = this.choice(this.startWords1);
    let tweet = [word];
    while (this.wordStats1[word]) {
        let nextWords = this.wordStats1[word];
        word = this.choice(nextWords);
        tweet.push(word);
        if (tweet.length > minLength && this.terminals1[word]) break;
    }
    if (tweet.length < minLength) return this.makeTweet(minLength);
    return tweet.join(' ');
  }

  displayTitle() {
    let title = this.makeTitle(minLength);
    this.setState({ title: title });
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
    let usercount = (this.refs.count.value) ? this.refs.count.value : count;
    this.setState({ username: this.refs.name.value, count: usercount }, () => {
      this.getTweets(this.state.username, this.state.count);
    });
    this.refs.name.value = '';
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Grid>
          <Row>
            <Col xs={12} md={12} lg={12}>
              { /*
              <Button onClick={this.displayTitle.bind(this)}>Generate</Button>
              <br />
              <h5 className="title">{this.state.title}</h5>
              */ }
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <h5 className="subtitle">Generate Markov chains based on user tweets!</h5>
              <form onSubmit={this.handleSubmit.bind(this)}>
                <FormGroup>
                  <input
                    className="form-control"
                    type="text"
                    ref="name"
                    placeholder="Enter Twitter username"
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    className="form-control"
                    type="number"
                    ref="count"
                    placeholder="Enter tweet amount to generate chain (25 if left blank)"
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
