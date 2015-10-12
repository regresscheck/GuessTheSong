var roomIdToString = require('./misc').roomIdToString;
var passportSocketIo = require('passport.socketio');
var generalSettings = require('./../config/general');
var sessionStore = require('./session-store');
var emitters = require('./emitters');
var PlayerController = require('./player-controller');
var Set = require('collections/set');


// NEED TO CONTROL SOCKETS PROPERLY
module.exports = function(io) {
    var allClients = [];
    var emptyIds = new Set();

    function onAuthorizeSuccess(data, accept) {
        accept();
    }

    function onAuthorizeFail(data, message, error, accept) {
        if (error)
            accept(new Error(message));
    }

    function addSocket(socket) {
        if (emptyIds.length === 0) {
            allClients.push(socket);
            return allClients.length - 1;
        }
        var emptyId = emptyIds.shift();
        allClients[emptyId] = socket;
        return emptyId;
    }

    io.use(passportSocketIo.authorize({
        secret: generalSettings.sessionSecret,
        store: sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));
    io.on('connection', function (socket) {
        var id = addSocket(socket);
        var player = PlayerController.getPlayer(id, socket);
        socket.on('disconnect', function () {
            var i = allClients.indexOf(socket);
            allClients[i] = null;
            emptyIds.add(i);
            if (player.roomId !== 'undefined') {
                emitters.chatEmitter.emit('leftRoom', player, {
                    roomId: player.roomId
                })
            }
        });
        socket.on('joinRoom', function(data) {
            player.roomId = data.roomId;
            socket.join(roomIdToString(data.roomId));
            emitters.chatEmitter.emit('joinRoom', player, data);
        });
        socket.on('message', function(data) {
            if (typeof data.message === 'string')
                emitters.chatEmitter.emit('message', player, data);
        });
        socket.on('startGame', function(data) {
            emitters.chatEmitter.emit('startGame', player, data);
        });
    });
    emitters.socketEmitter.on('sendToRoom', function(roomId, event, data) {
        io.to(roomIdToString(roomId)).emit(event, data);
    });
    emitters.socketEmitter.on('sendToPlayer', function(player, event, data) {
        if (allClients[player.socketId] && allClients[player.socketId].request.user.id === player.user.id)
            allClients[player.socketId].emit(event, data);
    });
};
