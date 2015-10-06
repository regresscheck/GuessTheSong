var express = require('express');
var router = express.Router();
var room_controller = require('./../source/room-controller');
var isLoggedIn = require('./../source/misc').isLoggedIn;

/* GET home page. */
router.get('/:id', isLoggedIn, function (req, res) {
    res.render('game', {room: room_controller.getRoom(req.params.id)});
});


module.exports = router;