var express = require('express');
var router = express.Router();

var roomController = require('./../source/room-controller');


router.get('/', function (req, res) {
    res.render('lobby', {rooms: roomController.rooms});
});

router.post('/create', function (req, res) {
    roomController.createRoom(req.body.name, 'b', 'c');
    res.redirect('/lobby');
});

module.exports = router;