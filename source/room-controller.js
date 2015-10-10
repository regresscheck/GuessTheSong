var Room = require('./room.js');
var winston = require('winston');

function RoomController() {
	this.rooms = [];
}

RoomController.prototype.createRoom = function(name, type, pass) {
	winston.info('Creating new room');
	this.rooms.push(new Room(this.rooms.length, name, type, pass));
	return this.rooms.length - 1;
};

RoomController.prototype.getRoom = function(id) {
	return this.rooms[id];
};

RoomController.prototype.roomExists = function(id) {
	var intId = Number(id);
    return Number.isInteger(intId) && intId >= 0 && intId < this.rooms.length;
};

module.exports = new RoomController();
