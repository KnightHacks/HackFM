var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');

var musicList = new Array();

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
  socket.emit('online', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on("hi", function(data) {
    console.log(data);
  });
  socket.on('click', function(data){
      musicList.push(data);
      console.log(musicList.toString());
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
