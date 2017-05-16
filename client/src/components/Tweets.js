import React from 'react';
import javascript_time_ago from 'javascript-time-ago';
javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');
const timeAgo = new javascript_time_ago('en-US');
const twitter = timeAgo.style.twitter();

function Tweets(props) {
  let title = (props.tweets.length > 0) ?
    <h5 className="subtitle">The <strong>{props.count}</strong> {(props.count > 1) ? 'tweets' : 'tweet'} from <strong>{props.username}</strong> @{props.handle} used to generate this Markov chain (tweet):</h5> : '';
  let tweets = props.tweets.map((tweet, i) =>
    <div key={i}>
      <span className="fetchedtitle"><strong>{tweet.user.name}</strong> @{props.handle} </span>
      <span className="fetchedtime">
        <i>{(new Date().getDate() === new Date(tweet.created_at).getDate()) ? `${timeAgo.format(new Date(tweet.created_at))} today` :
          `${timeAgo.format(new Date(tweet.created_at))} on ${timeAgo.format(new Date(tweet.created_at), twitter)}`}
        </i>
      </span>
      <p className="fetchedtext">{tweet.text}</p>
    </div>
  );
  return (
    <div>
      {title}
      {tweets}
    </div>
  );
}

export default Tweets;
