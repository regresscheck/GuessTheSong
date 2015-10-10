var chatController = require('./chat-controller');

function SongPlayer(roomId) {
    this.roomId = roomId;
}

SongPlayer.prototype.playSong = function(song) {
    if (!song)
        return;
    chatController.sendToRoom(this.roomId, 'playSong', {
        path: '/play/' + song.filename
    });
};

SongPlayer.prototype.stopSong = function() {
    chatController.sendToRoom(this.roomId, 'stopSong');
};

module.exports = SongPlayer;