var roomIdToString = require('./misc').roomIdToString;
var passportSocketIo = require('passport.socketio');
var generalSettings = require('./../config/general');
var sessionStore = require('./session-store');
var emitters = require('./emitters');



// NEED TO CONTROL SOCKETS PROPERLY
module.exports = function(io) {
    var allClients = [];

    function onAuthorizeSuccess(data, accept) {
        accept();
    }

    function onAuthorizeFail(data, message, error, accept) {
        if (error)
            accept(new Error(message));
    }

    function addSocket(socket) {
        allClients.push(socket);
        return allClients.size - 1;
    }

    io.use(passportSocketIo.authorize({
        secret: generalSettings.sessionSecret,
        store: sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));
    io.on('connection', function (socket) {
        var id = addSocket(socket);
        socket.on('disconnect', function () {
            var i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });
        socket.on('joinRoom', function(data) {
            socket.join(roomIdToString(data.roomId));
        });
        socket.on('message', function(data) {
            emitters.chatEmitter.emit('message', id, data);
        });
        socket.on('startGame', function(data) {
            emitters.chatEmitter.emit('startGame', id, data);
        });
    });
    emitters.socketEmitter.on('sendToRoom', function(roomId, event, data) {
        io.to(roomIdToString(roomId)).emit(event, data);
    });
    emitters.socketEmitter.on('sendToUser', function(socketId, event, data) {
        allClients[socketId].emit(event, data);
    });
};
