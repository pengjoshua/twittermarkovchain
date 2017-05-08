const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const Twitter = require('twitter');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/:name/:count', (req, res) => {
  const client = new Twitter({
    consumer_key: '2XiHjHTGpZ9xSS8CGxj3DJZHe',
    consumer_secret: 'WqzkKhBsBAdHfPHy09XDQoHVzOdreiLRs1pPUpP5fCDYQlrwGw',
    access_token_key: '1639459152-DSGj1DaIzL6CmnlyTvK6F5QB0yyMXVizxKSUVFX',
    access_token_secret: 'oRmkJZGqRPFUdzJWzkNDbbbiYNnclcxjNZkkw5g16p18e'
  });
  Promise.promisifyAll(client);
  client.getAsync('statuses/user_timeline', { screen_name: req.params.name, count: req.params.count })
  .then(tweets => {
    res.send(tweets);
  })
  .catch(error => {
    console.log(error);
  });
});

module.exports = app;
