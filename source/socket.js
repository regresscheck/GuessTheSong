module.exports = function(io) {
    var allClients = [];
    io.on('connection', function (socket) {
        allClients.push(socket);
        socket.on('disconnect', function () {
            var i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });
        socket.on('join_room', function(data) {
            console.log('join_room:');
            console.log(data);
        });
        socket.on('message', function(data) {
            console.log('message:');
            console.log(data);
        });
    });
};
