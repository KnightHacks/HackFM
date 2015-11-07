var socket = io();
socket.on('online', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
setTimeout(function() {
  socket.emit("hi", {"hello": "test"});
  console.log("emit");
}, 5000);

