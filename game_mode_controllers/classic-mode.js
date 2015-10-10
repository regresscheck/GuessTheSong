var chatController = require('./../source/chat-controller');
var Map = require('collections/map');
var generalSettings = require('./../config/general');
var Worker = require('webworker-threads').Worker;
var natural = require('natural');
var Player = require('./../source/player-controller').Player;
var escape = require('escape-html');

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
    chatController.sendToRoom(this.controllers.gameController.roomId, 'showPlayedSong', {
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
    chatController.sendToRoom(this.controllers.gameController.roomId, 'setScore', {
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
};

ClassicMode.prototype.onPlayerLeft = function(player) {
};

var worker = new Worker(function() {
    function checkAnswer(functionString, maxLength, songArtist, songTitle, answer) {
        eval('var LevenshteinDistance = ' + functionString);
        var correctArtistPrepared = songArtist.toLowerCase().substr(0, maxLength);
        var correctTitlePrepared = songTitle.toLowerCase().substr(0, maxLength);
        var answerPrepared = answer.toLowerCase().substr(0, maxLength);
        var artistLevenshtein = LevenshteinDistance(correctArtistPrepared, answerPrepared);
        var titleLevenshtein = LevenshteinDistance(correctTitlePrepared, answerPrepared);
        var artistSimilarity = 1 - artistLevenshtein / correctArtistPrepared.length;
        var titleSimilarity = 1 - titleLevenshtein / correctTitlePrepared.length;
        return {
            correctArtist: artistSimilarity > 0.8,
            correctTitle: titleSimilarity > 0.8/*,
            debug: {
                artistSimilarity: artistSimilarity,
                titleSimilarity: titleSimilarity,
                artistLevenshtein: artistLevenshtein,
                titleLevenshtein: titleLevenshtein,
                correctArtistPrepared: correctArtistPrepared,
                LevenshteinDistance: LevenshteinDistance('huy', 'huylo')
            }
            */
        };
    }
    this.onmessage = function(event) {
        try {
            postMessage(checkAnswer(event.data.LevenshteinDistance, event.data.maxLength, event.data.songArtist, event.data.songTitle, event.data.answer));
        } catch (err) {
            postMessage({
                error: err.message
            });
        }
    }
});
ClassicMode.prototype.handleMessage = function(song, player, data) {
    var self = this;
    worker.onmessage = function(event) {
        if (event.data.error) {
            console.error('Error in worker:', event.data.error);
            return;
        }
        //console.log(event.data.debug);
        chatController.sendToRoom(data.roomId, 'message', {
            message: escape(player.user.name + ': ' + data.message)
        });
        var result = event.data;
        var userScore = 0;
        if (result.correctArtist && !self.answeredArtist) {
            userScore += 1;
            self.answeredArtist = true;
        }
        if (result.correctTitle && !self.answeredTitle) {
            userScore += 1;
            self.answeredTitle = true;
        }
        var previousScore = self.scores.get(player);
        self.scores.set(player, previousScore + userScore);
        if (self.answeredArtist && self.answeredTitle) {
            self.controllers.roundController.endNow();
        }
        if (userScore > 0) {
            self.sendScoresToRoom();
        }
    };
    worker.postMessage({
        LevenshteinDistance: natural.LevenshteinDistance.toString(),
        maxLength: generalSettings.maximumAnswerLength,
        songArtist: song.artist,
        songTitle: song.title,
        answer: data.message
    });
};

module.exports = ClassicMode;
