var RoundController = require('./round-controller');
var chatController = require('./chat-controller');
var syncLoop = require('./misc').syncLoop;
var GameModeControllers = require('./../game_mode_controllers');
var SongController = require('./song-controller');

function GameController() {
    this.roundController = null;
    this.started = false;
    this.gameModeController = new GameModeControllers.ClassicMode();
    this.songController = new SongController();
}

GameController.prototype.handleMessage = function(user, data) {
    if (this.roundController) {
        this.roundController.handleMessage(user, data);
    }
    else {
        chatController.sendToRoom(data.roomId, 'message', data);
    }
};

GameController.prototype.startGame = function() {
    if (this.started)
        return;
    var self = this;
    self.started = true;
    self.songController.init(5, function() {
        syncLoop(5, function(loop) {
            var song = self.songController.getNextSong();
            self.roundController = new RoundController(self.gameModeController, song);
            self.gameModeController.onNewRound();
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