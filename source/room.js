var GameController = require('./game-controller');
var SongPlayer = require('./song-player');
var Set = require('collections/set');
var Player = require('./player-controller').Player;

function Room(id, name, type, pass){
    this.id = id;
    this.name = name;
    this.type = type;
    this.players = new Set({}, Player.equal, Player.hash);
    this.songPlayer = new SongPlayer(this.id);
    this.gameController = new GameController(this.id, {
        room: this,
        songPlayer: this.songPlayer
    });
}


Room.prototype.handleMessage = function(player, message) {
    this.gameController.handleMessage(player, message);
};

Room.prototype.addPlayer = function(player) {
    this.players.add(player);
    this.gameController.onPlayerJoin(player);
};

Room.prototype.removePlayer = function(player) {
    this.players.delete(player);
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

module.exports = Room;
