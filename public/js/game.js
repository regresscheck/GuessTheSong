$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit("joinRoom", {roomId: roomId});
    });
    socket.on('message', function(data) {
        $('#chat').prepend(data.message + '\n');
    });
    socket.on('playSong', function(data) {
        if (typeof audio === 'undefined') {
            audio = new Audio();
        }
        audio.src = data.path;
        audio.play();
    });
    socket.on('stopSong', function(data) {
        if (typeof audio === 'undefined')
            return;
        audio.pause();
    });
    socket.on('showPlayedSong', function(data) {
        $('#chat').prepend('Song: ' + data.artist + ' - ' + data.title + '\n');
    });
    socket.on('setScore', function(data) {
        var table = $('#score');
        table.empty();
        for (var i = 0; i < data.scores.length; i++) {
            console.log(data.scores[i]);
            table.append('<tr><td>' + data.scores[i].player.name + '</td><td>' + data.scores[i].score.toString() + '</td></tr>');
        }
    });

});

function sendMessage() {
    socket.emit("message", {
        roomId: roomId,
        message: $('#message').val()});
    $('#message_form')[0].reset();
    return false;
}

function startGame() {
    socket.emit("startGame", {
        roomId: roomId
    });
}
