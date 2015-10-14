var express = require('express');
var router = express.Router();
var isLoggedIn = require('./../source/misc').isLoggedIn;
var roomController = require('./../source/room-controller');


router.get('/', function (req, res) {
    res.render('lobby', {rooms: roomController.getRooms()});
});

router.post('/create', isLoggedIn, function (req, res) {
    roomController.createRoom(req.user.id, req.body.name, '', function(roomId) {
        res.redirect('/game/' + roomId);
    });
});

module.exports = router;