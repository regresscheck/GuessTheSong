var rm = require('./room.js');

function RoomController() {
	this.rooms = [];
}

RoomController.prototype.createRoom = function(name, type, pass) {
	this.rooms.push(new rm.Room(name, type, pass));
	return this.rooms.length;
}

RoomController.prototype.getRoom = function(id) {
	return this.rooms[id];
}

RoomController.prototype.getRoomList	 = function() {
	return this.rooms;
}

module.exports = new RoomController();
