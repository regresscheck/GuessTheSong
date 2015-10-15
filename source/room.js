var GameController = require('./game-controller');
var SongPlayer = require('./song-player');
var Set = require('collections/set');
var Player = require('./player-controller').Player;
var generalSettings = require('./../config/general');
var roomController;
var winston = require('winston');

// Cyclic requirement
setTimeout(function() {
    roomController = require('./room-controller');
}, 1000);

function Room(id, ownerId, name, password){
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.password = password;
    this.players = new Set({}, Player.equal, Player.hash);
    this.songPlayer = new SongPlayer(this);
    this.gameController = new GameController(this, {
        room: this,
        songPlayer: this.songPlayer
    });
    this.startRemoveTimer();
}


Room.prototype.handleMessage = function(player, message) {
    this.gameController.handleMessage(player, message);
};

Room.prototype.startRemoveTimer = function() {
    var self = this;
    this.removeTimer = setTimeout(function() {
        self.destruct();
    }, generalSettings.roomDeleteInactivityTime * 1000);
};

Room.prototype.addPlayer = function(player) {
    this.players.add(player);
    this.gameController.onPlayerJoin(player);
    if (this.removeTimer) {
        clearTimeout(this.removeTimer);
        this.removeTimer = null;
    }
};

Room.prototype.removePlayer = function(player) {
    this.players.delete(player);
    if (this.players.length === 0) {
        this.startRemoveTimer();
    }

    this.gameController.onPlayerLeft(player);
};

Room.prototype.getSendablePlayers = function() {
    var sendablePlayers = [];
    this.players.forEach(function(player) {
        sendablePlayers.push({
            player: player.toSendable(),
            score: 0
        });
    });
    return sendablePlayers;
};

Room.prototype.destruct = function() {
    winston.info('Deleting room', this.id);
    roomController.removeRoom(this.id);
    this.gameController.destruct();
};

module.exports = Room;
