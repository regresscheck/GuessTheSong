$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit("join_room", {room_id: room_id});
    });
    socket.on('message', function(data) {
        $('#chat').prepend(data.message + '\n');
    });

});

function send_message() {
    socket.emit("message", {
        room_id: room_id,
        message: $('#message').val()});
    $('#message_form')[0].reset();
    return false;
}
