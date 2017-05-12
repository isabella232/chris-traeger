'use strict';

var _       = require('lodash');
var express = require('express');
var http    = require('http');
var moment  = require('moment');
var twitter = require('twitter');

var config = require('./config.json');

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var express = require("express");
var app = express();

app.set('view engine', 'html');
app.set('layout', 'layout');
app.enable('view cache');
app.engine('html', require('hogan-express'));

app.use(express.static(__dirname + '/public'));
var server = http.createServer(app);
server.listen(process.env.PORT || 7080);

var io = require('socket.io').listen(server);

app.get('/', (req, res) => {
  res.render('index');
});

var params = {
  screen_name: 'LobProps',
  count: 40
}

io.on('connection', (socket) => {
  socket.on('send', () => {
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
      tweets = tweets || [];

      tweets = _.shuffle(tweets);

      tweets.forEach((data) =>  {
        socket.emit('tweet', { tweet: data });
      });
    });
  });
});
