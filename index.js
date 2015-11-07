var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');
var YouTube = require('youtube-node');

// Starts our YouTube
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

// Stores the list of songs
var musicList = new Array();

// The ranking for the current song
// Threshold will be -3
var ranking = 0;

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.post('/api/upload_song', function(req, res) {
  var file = req.body.image.split("base64,")[1];
  console.log(file);
  fs.writeFile("tmpfiles/" + (new Date).getTime() + ".jpg", file, 'base64', function(err) {
    console.log(err);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('online', musicList);
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on("hi", function(data) {
    console.log(data);
  });
  socket.on('click', function(data){
      musicList.push(data);
      console.log(musicList.toString());
      socket.emit('playlist-update', musicList);

      // Parse out the id
      var video_id = data.split('v=')[1];
      var ampersandIndex = video_id.indexOf('&');
      if(ampersandIndex != -1){
          video_id = video_id.substring(0, ampersandIndex);
      }

      // Get video by id
      youTube.getById(video_id, function(error, result) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(result.items[0].snippet.title);

        }
      });

  });
  socket.on('like', function(){
      ranking++;
      console.log("Increase Ranking\nCurrent Ranking: " + ranking);
  });
  socket.on('dislike', function(){
      ranking--;
      console.log("Decrease Ranking\nCurrent Ranking: " + ranking);
      if(ranking < -3){
          // Switch video
      }
  });
  socket.on('video-done', function() {
	musicList.splice(1);
	socket.emit('new-song', musicList[0]);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
