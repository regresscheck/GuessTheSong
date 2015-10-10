var RoundController = require('./round-controller');
var chatController = require('./chat-controller');
var syncLoop = require('./misc').syncLoop;
var GameModeControllers = require('./../game_mode_controllers');
var SongController = require('./song-controller');
var escape = require('escape-html');

function GameController(roomId, controllers) {
    this.roomId = roomId;
    this.roundController = null;
    this.started = false;
    this.songController = new SongController();
    this.songPlayer = controllers.songPlayer;
    this.controllers = controllers;
    this.roundDuration = 30;
    this.roundsCount = 10;
    controllers.gameController = this;
    controllers.songController = this.songController;
    this.gameModeController = new GameModeControllers.ClassicMode(controllers);
}

GameController.prototype.handleMessage = function(player, data) {
    if (this.roundController) {
        this.roundController.handleMessage(player, data);
    }
    else {
        chatController.sendToRoom(this.roomId, 'message', {
            message: escape(player.user.name + ': ' + data.message)
        });
    }
};

GameController.prototype.onPlayerJoin = function(player) {
    if (this.roundController) {
        this.roundController.onPlayerJoin(player);
    } else {
        chatController.sendToRoom(this.roomId, 'setScore', {
            scores: this.controllers.room.getSendablePlayers()
        });
    }
};

GameController.prototype.onPlayerLeft = function(player) {
    if (this.roundController) {
        this.roundController.onPlayerLeft(player);
    } else {
        chatController.sendToRoom(this.roomId, 'setScore', {
            scores: this.controllers.room.getSendablePlayers()
        });
    }
};

GameController.prototype.startGame = function() {
    if (this.started)
        return;
    var self = this;
    self.started = true;
    self.songController.init(self.roundsCount, function() {
        self.gameModeController.onNewGame();
        syncLoop(self.roundsCount, function(loop) {
            var song = self.songController.getNextSong();
            self.roundController = new RoundController(self.gameModeController, song, self.roundDuration);
            self.roundController.start(function() {
                loop.next();
            });
        }, function() {
            self.gameModeController.onGameEnd();
            self.roundController = null;
            self.started = false;
        });
    });
};

module.exports = GameController;