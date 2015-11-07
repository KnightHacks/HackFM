var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var musicList = new Array();


app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
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
      console.log(data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
