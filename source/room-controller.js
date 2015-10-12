var Room = require('./room.js');
var winston = require('winston');
var Set = require('collections/set');

function RoomController() {
	this.rooms = [];
    this.emptyIds = new Set();
}

RoomController.prototype.createRoom = function(name, type, pass, callback) {
	winston.info('Creating new room');
	if (this.emptyIds.length === 0) {
        this.rooms.push(new Room(this.rooms.length, name, type, pass));
        return callback(this.rooms.length - 1);
    }
    var roomId = this.emptyIds.shift();
    this.rooms[roomId] = new Room(roomId, name, type, pass);
    return callback(roomId);
};

RoomController.prototype.removeRoom = function(roomId) {
    this.rooms[roomId] = null;
    this.emptyIds.add(roomId);
}

RoomController.prototype.getRoom = function(id) {
	return this.rooms[id];
};

RoomController.prototype.roomExists = function(id) {
	var intId = Number(id);
    return Number.isInteger(intId) && intId >= 0 && intId < this.rooms.length && this.rooms[id];
};


RoomController.prototype.getRooms = function() {
    return this.rooms;
}

module.exports = new RoomController();
