$(document).ready(function() {

  var tweets = [];

  var socket = io();
  socket.on('tweet', function(data) {
    tweets.push(data.tweet);
    $(".stats__pending .data").text(tweets.length);
  });

  setInterval(function() {
    if (tweets.length < 10) {
      socket.emit('send', {});
    }

    var tweet = tweets.shift();
    if(tweet != null) {

      $(".tweet__user").fadeOut();
      $(".tweet__time").fadeOut();

      $(".tweet__text").fadeReplace(tweet.text, function(text) {
        return text.replace(/(@\w+)/g, "<span class='username'>\$1</span>")
          .replace(/(#\w+)/g, "<span class='hashtag'>\$1</span>")
          .replace(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i, "<span class='url'>\$1</span>");
      }, function() {
        $(".tweet__user").text("@" + tweet.user.screen_name);
        $(".tweet__time abbr").attr('title', tweet.created_at);
        $(".timeago").timeago();
        $(".tweet__user").fadeIn(500);
        $(".tweet__time").fadeIn(500);
      });

      $(".stats__pending .data").text(tweets.length);
    }
  }, 6000)
});
