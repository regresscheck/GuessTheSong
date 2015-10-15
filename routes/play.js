var express = require('express');
var router = express.Router();
var fs = require('fs');
var tocUtils = require('./../source/mp3-toc-utils');
var roomController = require('./../source/room-controller');
var winston = require('winston');

router.get('/:roomId', function(req, res) {
    var roomId = Number(req.params.roomId);
    var room = roomController.getRoom(roomId);
    if (!room) {
        return res.status(400).send('Wrong room');
    }
    if (!room.songPlayer.song) {
        return res.status(400).send('No song playing');
    }
    var currentTime = new Date();
    var secondsDifference = Math.floor(Math.abs(room.songPlayer.startTime.getTime() - currentTime.getTime()) / 1000);
    var song = room.songPlayer.song;
    var filePath = 'songs/' + song.filename;
    var tocPath = 'toc/' + song.filename.replace('.mp3', '.toc');
    var startPos = tocUtils.posForTime(tocPath, song.startTime + secondsDifference);
    var endPos = tocUtils.posForTime(tocPath, song.endTime);
    if (startPos === -1 || endPos === -1 || endPos < startPos) {
        winston.warn('Called play with wrong time. Song:', song);
        return res.status(400).send('Wrong time');
    }
    res.type('.mp3');
    var stream = fs.createReadStream(filePath, {start: startPos, end: endPos});
    res.on('close', function() {
        stream.destroy();
    });
    stream.pipe(res);
});

module.exports = router;