var express = require('express');
var router = express.Router();
var fs = require('fs');
var tocUtils = require('./../source/mp3-toc-utils');

router.get('/:filepath', function (req, res) {
    /*
    res.sendFile('songs/' + req.params.filepath, {
        root: __base
    });
    */
    var filePath = 'songs/' + req.params.filepath;
    var tocPath = filePath.replace('.mp3', '.toc');
    var startTime = Number(req.query.s || 0);
    var endTime = Number(req.query.e || 0);
    /*
    tocUtils.ffProbePath('./ffprobe.exe');
    tocUtils.generate(filePath, function(buffer) {
        fs.writeFileSync(tocPath, buffer);
    });
    */
    console.log(startTime);
    var startPos = tocUtils.posForTime(tocPath, startTime);
    var endPos = tocUtils.posForTime(tocPath, endTime);
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