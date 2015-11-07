var socket = io();
socket.on('online', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
setTimeout(function() {
  socket.emit("hi", {"hello": "test"});
  console.log("emit");
}, 5000);

window.onload = function() {
  document.querySelector("#fileUpload").onchange = function(e) {
    var files = e.target.files;
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = function(e) {
        e = e || window.event;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload_song");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify({ "image": e.target.result, "real": "problematic" }));
      };
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
}

sendYoutube = function() {
    socket.emit('click', document.getElementById("m").value);
    console.log("emit");
}
