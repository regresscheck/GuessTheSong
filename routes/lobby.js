var express = require('express');
var router = express.Router();

var roomController = require('./../source/room-controller');


router.get('/', function (req, res) {
    res.render('lobby', {rooms: roomController.getRooms()});
});

router.post('/create', function (req, res) {
    roomController.createRoom(req.body.name, 'b', 'c', function(roomId) {
        res.redirect('/game/' + roomId);
    });
});

module.exports = router;