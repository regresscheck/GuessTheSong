/**
 * Created by Федор on 09.09.2015.
 */
var express = require('express');
var router = express.Router();

var path = require('path');
var room_controller = require(path.join(__base, 'source', 'room_controller.js'))

/* GET home page. */

router.get('/', function (req, res) {
    res.render('lobby', {rooms: room_controller.rooms});
});

// NOT IMPLEMENTED, CHECK ARGS
router.post('/create', function (req, res) {
    console.log(req.body);
    room_controller.createRoom(req.body.name, 'b', 'c');
    res.redirect('/lobby');
});

module.exports = router;