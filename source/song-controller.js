// TODO: Add error handling for Sequelize

var models = require('./../models');
var getRandomInt = require('./misc').getRandomInt;

function SongController(duration) {
    this.songs = [];
    this.songDuration = duration;
}

SongController.prototype.init = function(songsCount, next) {
    var self = this;
    models.Song.findAll({
        limit: songsCount,
        order: [
            models.Sequelize.fn('RAND')
        ]
    }).then(function(songs) {
        while (2 * songs.length <= songsCount) {
            songs = songs.concat(songs);
        }
        if (songs.length < songsCount) {
            songs = songs.concat(songs.slice(0, songsCount - songs.length));
        }
        self.songs = songs;
        self.songs.forEach(function(song) {
            song.startTime = getRandomInt(0, song.duration - self.songDuration);
            song.endTime = song.startTime + self.songDuration;
        });
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