$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':3001');
    socket.on('connect', function() {
        socket.emit("join_room", {room_id: room_id});
    });

});

function send_message() {
    socket.emit("message", {
        room_id: room_id,
        message: $('#message').val()});
    $('#message_form')[0].reset();
    return false;
}
