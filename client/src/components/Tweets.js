import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import javascript_time_ago from 'javascript-time-ago';
javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');

function Tweets(props) {
  const timeAgo = new javascript_time_ago('en-US');
  const twitter = timeAgo.style.twitter();
  let title = (props.tweets.length > 0) ?
    <h6 className="subtitle">The <strong>{props.count}</strong> tweets from <strong>{props.username}</strong> used to generate this chain:</h6> : '';
  let tweets = props.tweets.map((tweet, i) =>
    <Col key={i}>
      <br />
      <strong>{tweet.user.name} </strong>
      <i>{timeAgo.format(new Date(tweet.created_at)) + ' on ' + timeAgo.format(new Date(tweet.created_at), twitter)}</i>
      <br />
      {tweet.text}
    </Col>
  );
    return (
    <Grid>
      <Row>
        {title}
        {tweets}
      </Row>
    </Grid>
  );
}

export default Tweets;
