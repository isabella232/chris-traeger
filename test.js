var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

client.get('statuses/user_timeline', { screen_name: 'nodejs' }, function(error, tweets, response) {

  console.log(error);
  console.log(tweets);
  console.log(response);

  tweets = tweets || [];

  tweets.forEach((data) =>  {
    var containsBannedWord = new RegExp(bannedWords, 'i').test(data.text) === true;
    if (!containsBannedWord) {
      io.sockets.emit('tweet', { tweet: data });
    }
  });

});
