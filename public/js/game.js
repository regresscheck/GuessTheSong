$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit("joinRoom", {roomId: roomId});
    });
    socket.on('message', function(data) {
        $('#chat').prepend(data.message + '\n');
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
