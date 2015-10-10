var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:filepath', function (req, res) {
    /*
    res.sendFile('songs/' + req.params.filepath, {
        root: __base
    });
    */
    var startTime = Number(req.query.s || 0);
    console.log(startTime);
    var filePath = req.params.filepath;
    var stream = fs.createReadStream('songs/' + filePath, {start: startTime});
    res.type('.mp3');
    res.on('close', function() {
        stream.destroy();
    });
    stream.pipe(res);
});

module.exports = router;