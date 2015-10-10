var express = require('express');
var router = express.Router();
var roomController = require('./../source/room-controller');
var isLoggedIn = require('./../source/misc').isLoggedIn;

/* GET home page. */
router.get('/:id', isLoggedIn, function (req, res) {
    if (roomController.roomExists(req.params.id))
        res.render('game', {room: roomController.getRoom(req.params.id)});
    else
        res.status(404).send('Wrong room');
});


module.exports = router;