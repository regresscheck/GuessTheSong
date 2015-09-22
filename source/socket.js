var escape = require('escape-html');
var roomIdToString = require('./misc').roomIdToString;


module.exports = function(io) {
    var allClients = [];
    io.on('connection', function (socket) {
        allClients.push(socket);
        socket.on('disconnect', function () {
            var i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });
        socket.on('join_room', function(data) {
            socket.join(roomIdToString(data.room_id));
        });
        socket.on('message', function(data) {
            io.to(roomIdToString(data.room_id)).emit('message', {
                message: escape(data.message)
            });
        });
    });
};
