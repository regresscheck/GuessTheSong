var RoundController = require('./round-controller');
var chatController = require('./chat-controller');
var syncLoop = require('./misc').syncLoop;
var GameModeControllers = require('./../game_mode_controllers');

function GameController() {
    this.roundController = null;
    this.started = false;
    this.gameModeController = new GameModeControllers.ClassicMode();
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
    syncLoop(5, function(loop) {
        self.roundController = new RoundController(self.gameModeController, null);
        self.roundController.start(function() {
            loop.next();
        });
    }, function() {
        self.roundController = null;
        self.started = false;
    });
};

module.exports = GameController;