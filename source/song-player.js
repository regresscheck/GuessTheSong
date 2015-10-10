var chatController = require('./chat-controller');
var tocUtils = require('./mp3-toc-utils');
var fs = require('fs');
var ss = require('socket.io-stream');

function SongPlayer(roomId) {
    this.roomId = roomId;
}

SongPlayer.prototype.playSong = function(song) {
    if (!song)
        return;
    chatController.sendToRoom(this.roomId, 'playSong', {
        path: '/play/' + song.filename + '?s=' + song.startTime + '&e=' + song.endTime
    });

};

SongPlayer.prototype.stopSong = function() {
    chatController.sendToRoom(this.roomId, 'stopSong');
};

module.exports = SongPlayer;