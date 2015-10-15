var chatController = require('./../source/chat-controller');
var Map = require('collections/map');
var generalSettings = require('./../config/general');
var Player = require('./../source/player-controller').Player;
var escape = require('escape-html');
var threadPool = require('webworker-threads').createPool(5);
threadPool.load(__dirname + '/classic-mode-thread.js');
var unidecode = require('unidecode');

function ClassicMode(controllers) {
    this.scores = new Map({}, Player.equal, Player.hash);
    this.controllers = controllers;
}

ClassicMode.prototype.onNewRound = function(song) {
    this.answeredArtist = false;
    this.answeredTitle = false;
    this.controllers.songPlayer.playSong(song);
};

ClassicMode.prototype.onRoundEnd = function(song) {
    chatController.sendToRoom(this.controllers.room, 'showPlayedSong', {
        artist: song.artist,
        title: song.title
    });
};

ClassicMode.prototype.onNewGame = function() {
    var self = this;
    this.controllers.room.players.forEach(function(player) {
        self.scores.set(player, 0);
    });
};
ClassicMode.prototype.onGameEnd = function() {
    this.controllers.songPlayer.stopSong();
};

ClassicMode.prototype.getSendableScores = function() {
    var sendableScores = [];
    this.scores.forEach(function(score, player) {
        sendableScores.push({
            player: player.toSendable(),
            score: score
        });
    });

    function compare(left, right) {
        return left.score > right.score;
    }

    sendableScores.sort(compare);
    return sendableScores;
};

ClassicMode.prototype.sendScoresToRoom = function() {
    var sendableScores = this.getSendableScores();
    chatController.sendToRoom(this.controllers.room, 'setScore', {
        scores: sendableScores
    });
};

ClassicMode.prototype.sendScoresToPlayer = function(player) {
    var sendableScores = this.getSendableScores();
    chatController.sendToPlayer(player, 'setScore', {
        scores: sendableScores
    });
};

ClassicMode.prototype.onPlayerJoin = function(player) {
    if (!this.scores.has(player)) {
        this.scores.set(player, 0);
        this.sendScoresToRoom();
    } else {
        this.sendScoresToPlayer(player);
    }
    this.controllers.songPlayer.updateSongOnPlayer(player);
};

ClassicMode.prototype.onPlayerLeft = function(player) {
};

ClassicMode.prototype.handleMessage = function(song, player, data) {
    var self = this;
    console.log(unidecode(data.message));
    threadPool.any.eval('checkAnswer(' + generalSettings.maximumAnswerLength + ', "' + encodeURI(unidecode(song.artist)) + '", "' +
        encodeURI(unidecode(song.title)) + '","' + encodeURI(unidecode(data.message)) + '")',
        function(err, resultString) {
            if (err) {
                console.error(err.toString(), '(THREAD)');
                return;
            }
            var result = JSON.parse(resultString);
            console.log(result);
            chatController.sendToRoom(self.controllers.room, 'message', {
                message: escape(player.user.name + ': ' + data.message)
            });
            var userScore = 0;
            if (result.correctArtist && !self.answeredArtist) {
                userScore += 1;
                self.answeredArtist = true;
                chatController.sendToRoom(self.controllers.room, 'message', {
                    message: escape(player.user.name + ' guessed the artist "' + song.artist + '" correctly!')
                });
            }
            if (result.correctTitle && !self.answeredTitle) {
                userScore += 1;
                self.answeredTitle = true;
                chatController.sendToRoom(self.controllers.room, 'message', {
                    message: escape(player.user.name + ' guessed the title "' + song.title + '" correctly!')
                });
            }
            var previousScore = self.scores.get(player);
            self.scores.set(player, previousScore + userScore);
            if (self.answeredArtist && self.answeredTitle) {
                self.controllers.roundController.endNow();
            }
            if (userScore > 0) {
                self.sendScoresToRoom();
            }
        });
};

module.exports = ClassicMode;
