var socket = io();
socket.on('online', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
setTimeout(function() {
  socket.emit("hi", {"hello": "test"});
  console.log("emit");
}, 5000);

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		   width: '640',
		   videoId: 'BG6FQYFqGE0',
		   events: {
			   'onReady': onPlayerReady,
		   'onStateChange': onPlayerStateChange
		   }
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(stopVideo, 6000);
		done = true;
	}
}
function stopVideo() {
	player.stopVideo();
}

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
