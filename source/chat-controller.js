var emitters = require('./emitters');
var roomController = require('./room-controller');

emitters.chatEmitter.on('message', function(user, data) {
    roomController.getRoom(data.roomId).handleMessage(user, data);
});

emitters.chatEmitter.on('startGame', function(user, data) {
    roomController.getRoom(data.roomId).gameController.startGame();
});

module.exports.sendToUser = function(user, event, data) {
    emitters.socketEmitter.emit('sendToUser', user.socketId, event, data);
};
module.exports.sendToRoom = function(roomId, event, data) {
    emitters.socketEmitter.emit('sendToRoom', roomId, event, data);
};
