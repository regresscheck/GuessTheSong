// TODO: Add error handling for Sequelize
// Обычный коммент

var Song = require('./../models').Song;

function SongController() {
    this.songs = [];
}

SongController.prototype.init = function(songsCount) {
    var self = this;
    Song.findAll({limit: songsCount}).then(function(songs) {
        self.songs = songs;
    });
};

SongController.prototype.getNextSong = function() {
    if (this.songs.length === 0)
        return null;
    var song = this.songs[-1];
    this.songs.pop();
    return song;
};

module.exports = SongController;