var emitters = require('./emitters');
var roomController = require('./room-controller');
var winston = require('winston');

emitters.chatEmitter.on('message', function(player, data) {
    if (roomController.roomExists(data.roomId))
        roomController.getRoom(data.roomId).handleMessage(player, data);
});

emitters.chatEmitter.on('startGame', function(player, data) {
    if (roomController.roomExists(data.roomId) && roomController.getRoom(data.roomId).ownerId === player.user.id)
        roomController.getRoom(data.roomId).gameController.startGame();
});

emitters.chatEmitter.on('joinRoom', function(player, data) {
    if (roomController.roomExists(data.roomId))
        roomController.getRoom(data.roomId).addPlayer(player);
});

emitters.chatEmitter.on('leftRoom', function(player, data) {
    if (roomController.roomExists(data.roomId))
        roomController.getRoom(data.roomId).removePlayer(player);
});

module.exports.sendToPlayer = function(player, event, data) {
    emitters.socketEmitter.emit('sendToPlayer', player, event, data);
};
module.exports.sendToRoom = function(room, event, data) {
    if (roomController.getRoom(room.id) != room) {
        winston.warn('Bad attempt of sending to room:', room.id, event, data);
        return;
    }
    emitters.socketEmitter.emit('sendToRoom', room.id, event, data);
};
