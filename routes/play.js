var express = require('express');
var router = express.Router();
var fs = require('fs');
var tocUtils = require('./../source/mp3-toc-utils');
var roomController = require('./../source/room-controller');

router.get('/:roomId', function(req, res) {
    var roomId = Number(req.params.roomId);
    if (!roomController.roomExists(roomId))
        return res.status(400).send('Wrong room');
    var room = roomController.getRoom(roomId);
    if (!room.songPlayer.song)
        return res.status(400).send('Wrong song ');
    var currentTime = new Date();
    var secondsDifference = Math.floor(Math.abs(room.songPlayer.startTime.getTime() - currentTime.getTime()) / 1000);
    var song = room.songPlayer.song;
    var filePath = 'songs/' + song.filename;
    var tocPath = filePath.replace('.mp3', '.toc');
    var startPos = tocUtils.posForTime(tocPath, song.startTime + secondsDifference);
    var endPos = tocUtils.posForTime(tocPath, song.endTime);
    if (startPos === -1 || endPos === -1 || endPos < startPos) {
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