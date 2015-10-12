var chatController = require('./chat-controller');
var tocUtils = require('./mp3-toc-utils');
var fs = require('fs');
var ss = require('socket.io-stream');

function SongPlayer(room) {
    this.room = room;
}

SongPlayer.prototype.playSong = function(song) {
    if (!song)
        return;
    this.startTime = new Date();
    this.song = song;
    chatController.sendToRoom(this.room, 'playSong', {
        path: '/play/' + this.room.id
    });

};

SongPlayer.prototype.updateSongOnPlayer = function(player) {
    if (!this.song)
        return;
    chatController.sendToPlayer(player, 'playSong', {
        path: '/play/' + this.roomId
    });
}

SongPlayer.prototype.stopSong = function() {
    this.song = null;
    chatController.sendToRoom(this.room, 'stopSong');
};

module.exports = SongPlayer;