var chatController = require('./chat-controller');


function RoundController(gameModeController, song, duration) {
    this.song = song;
    this.duration = duration;
    this.gameModeController = gameModeController;
    this.timer = null;
    this.endCallback = null;
    this.gameModeController.controllers.roundController = this;
}

RoundController.prototype.onEnd = function() {
    this.gameModeController.onRoundEnd(this.song);
    this.endCallback();
};

RoundController.prototype.endNow = function() {
    if (this.timer) {
        clearTimeout(this.timer);
        this.onEnd();
    }
};

RoundController.prototype.onPlayerJoin = function(player) {
    this.gameModeController.onPlayerJoin(player);
};

RoundController.prototype.onPlayerLeft = function(player) {
    this.gameModeController.onPlayerLeft(player);
};

RoundController.prototype.start = function(next) {
    var self = this;
    this.endCallback = next;
    this.gameModeController.onNewRound(this.song);
    this.timer = setTimeout(function() {
        self.onEnd();
    }, this.duration * 1000); // milliseconds
};

RoundController.prototype.handleMessage = function(player, data) {
    this.gameModeController.handleMessage(this.song, player, data);
};

RoundController.prototype.destruct = function() {
    if (this.timer) {
        clearTimeout(this.timer);
    }
};

module.exports = RoundController;