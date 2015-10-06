var chatController = require('./../source/chat-controller');

function ClassicMode() {
    this.score = {};
}

ClassicMode.prototype.handleMessage = function(song, user, data) {
    console.log('Zaebis');
    chatController.sendToRoom(data.roomId, 'message', data);
    return {
        user: user,
        correctArtist: (song.artist === data.message),
        correctTitle: (song.artist === data.message)
    };
};

ClassicMode.prototype.handleResult = function(result) {
    this.score[result.user] += result.correctArtist + result.correctTitle;
};

module.exports = ClassicMode;
