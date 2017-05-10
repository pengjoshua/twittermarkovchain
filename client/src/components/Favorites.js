import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import javascript_time_ago from 'javascript-time-ago';
javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');
const timeAgo = new javascript_time_ago('en-US');
const twitter = timeAgo.style.twitter();

function Favorites(props) {
  let uidTweets = props.tweets.filter(tweet => tweet.uid === props.uid);
  let title = (uidTweets.length > 0) ?
    <h5 className="subtitle">Your favorite generated chains (tweets)!</h5> : '';
  let tweets = uidTweets.map((tweet, i) =>
    <div key={i}>
      <span className="favoritestitle"><strong>{tweet.username} </strong></span>
      <span className="favoritestime">
        <i>{(new Date().getDate() === new Date(tweet.created_at).getDate()) ? `${timeAgo.format(new Date(tweet.created_at))} today` :
          `${timeAgo.format(new Date(tweet.created_at))} on ${timeAgo.format(new Date(tweet.created_at), twitter)}`}
        </i>
      </span>
      <p className="favoritestext">{tweet.text}</p>
      <Button className="button" bsStyle="danger" onClick={props.onClick.bind(this, tweet)}>
        <FontAwesome name="remove" />&nbsp;Delete
      </Button>
      <br /><br />
    </div>
  );
    return (
    <div>
      {title}
      {uidTweets.length > 0 ? tweets : ''}
    </div>
  );
}

export default Favorites;
