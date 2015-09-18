

module.exports = function(io) {
    var allClients = [];
    io.on('connection', function (socket) {
        allClients.push(socket);
        socket.on('disconnect', function () {
            var i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });
    });
};