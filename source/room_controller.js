var rm = require('./room.js');
var winston = require('winston');

function RoomController() {
	this.rooms = [];
}

RoomController.prototype.createRoom = function(name, type, pass) {
	winston.info('Creating new room');
	this.rooms.push(new rm.Room(name, type, pass));
	return this.rooms.length;
}

RoomController.prototype.getRoom = function(id) {
	return this.rooms[id];
}

module.exports = new RoomController();
