var express = require('express');
var router = express.Router();
var room_controller = require('./../source/room_controller');

/* GET home page. */
router.get('/:id', function (req, res) {
    res.render('game', {room: room_controller.getRoom(req.params.id)});
});


module.exports = router;