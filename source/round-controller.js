var chatController = require('./chat-controller');


function RoundController(gameModeController, song) {
    this.song = song;
    this.gameModeController = gameModeController;
    this.timer = null;
    this.endCallback = null;
}

RoundController.prototype.onEnd = function() {
    this.endCallback();
};

RoundController.prototype.endNow = function() {
    if (this.timer) {
        clearTimeout(this.timer);
        this.onEnd();
    }
};

RoundController.prototype.start = function(next) {
    var self = this;
    this.endCallback = next;
    this.timer = setTimeout(function() {
        self.onEnd();
    }, 5000);
};

RoundController.prototype.handleMessage = function(user, data) {
    this.gameModeController.handleMessage(this.song, user, data);
};

module.exports = RoundController;