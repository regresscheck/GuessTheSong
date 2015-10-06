var chatController = require('./../source/chat-controller');

function ClassicMode() {
    this.score = {};
}

ClassicMode.prototype.onNewRound = function() {
    this.answeredArtist = false;
    this.answeredTitle = false;
};
ClassicMode.prototype.onGameEnd = function() {
    console.log('Nut vot sobstvenno');
};

ClassicMode.prototype.handleMessage = function(functions, song, user, data) {
    chatController.sendToRoom(data.roomId, 'message', data);
    var correctArtist = (song.artist === data.message);
    var correctTitle = (song.title === data.message);
    var userScore = 0;
    if (correctArtist && !this.answeredArtist) {
        userScore += 1;
        this.answeredArtist = true;
    }
    if (correctTitle && !this.answeredTitle) {
        userScore += 1;
        this.answeredTitle = true;
    }
    this.score[user] += userScore;
    console.log('Answer: ', userScore);
    if (this.answeredArtist && this.answeredTitle) {
        functions.endNow();
    }
};

module.exports = ClassicMode;
