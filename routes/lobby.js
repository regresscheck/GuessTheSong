var express = require('express');
var router = express.Router();

var room_controller = require('./../source/room_controller');


router.get('/', function (req, res) {
    res.render('lobby', {rooms: room_controller.rooms});
});

router.post('/create', function (req, res) {
    console.log(req.body);
    room_controller.createRoom(req.body.name, 'b', 'c');
    res.redirect('/lobby');
});

module.exports = router;