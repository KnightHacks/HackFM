var socket = io();
var musicList = new Array();
var player;

socket.on('online', function (data) {
  musicList = data;
  renderQueue();
});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
  updateQueue(musicList);
}

function onPlayerReady(event) {
  event.target.playVideo();
}

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
  document.getElementById("m").value = "";
}


function increaseRanking() {
  socket.emit('like');
}

function decreaseRanking() {
  socket.emit('dislike');
}

socket.on('playlist-update', function(data){
  musicList = data;

  renderQueue();
  updateQueue(data);
});

function renderQueue() {
  var queue_list = document.getElementById("queue_list");
  var html = "";
  for (var i = 0; i < musicList.length; i++) {
    html += '<div class="queue_item"><img src="' + musicList[i].thumbnail + '"> ' + musicList[i].title + '</div>';
    console.log(musicList[i]);
  }
  queue_list.innerHTML = html;
}

function updateQueue(data) {
  if (!player && data.length > 0) {
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
        controls: 0,
        rel: 0,
        disablekb: 1,
        iv_load_policy: 3,
        autoplay: 0
      }
    });
  }
}

socket.on('new-song', function(data) {
  var songId = data.substr(-11);
  player.loadVideoById(songId);
});
