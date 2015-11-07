var socket = io();
var musicList = new Array();

socket.on('online', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
    musicList = data;
    renderQueue();
  });

setTimeout(function() {
  console.log("emit");
}, 5000);

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

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
		done = true;
	} else if (event.data == YT.PlayerState.ENDED) {
		socket.emit("video-done", musicList[0]);
	}
}
function stopVideo() {
	player.stopVideo();
}

// Takes in our URL through button
function sendYoutube() {
    var input = document.getElementById("m").value;
    socket.emit('click', input);
    console.log("emit");
}


function increaseRanking() {
    socket.emit('like');
}

function decreaseRanking() {
    socket.emit('dislike');
}

socket.on('playlist-update', function(data){
    musicList = data;
    // console.log("Playlist update " + data[data.length - 1].title);
    renderQueue();
	if (!player) {
        console.log(data);
		player = new YT.Player('player', {
			height: '390',
			   width: '640',
			   videoId: data[0].url.substr(-11),
			   events: {
				   'onReady': onPlayerReady,
			   'onStateChange': onPlayerStateChange
			   },
			   playerVars: {
				controls: 0
			   }
		});
	}
});

function renderQueue() {
  var queue_list = document.getElementById("queue_list");
  var html = "";
  for (var i = 0; i < musicList.length; i++) {
    html += '<div class="queue_item">' + musicList[i].title + '</div>';
  }
  queue_list.innerHTML = html;
}

socket.on('new-song', function(data) {
	var songId = data.substr(-11);
	player.loadVideoById(songId);
});
