// TODO: Add error handling for Sequelize
// Обычный коммент

var Song = require('./../models').Song;

function SongController() {
    this.songs = [];
}

SongController.prototype.init = function(songsCount, next) {
    var self = this;
    Song.findAll({limit: songsCount}).then(function(songs) {
        while (2 * songs.length <= songsCount) {
            songs = songs.concat(songs);
        }
        if (songs.length < songsCount) {
            songs = songs.concat(songs.slice(0, songsCount - songs.length));
        }
        self.songs = songs;
        next();
    });
};

SongController.prototype.getNextSong = function() {
    if (this.songs.length === 0)
        return null;
    var song = this.songs[this.songs.length - 1];
    this.songs.pop();
    return song;
};

module.exports = SongController;