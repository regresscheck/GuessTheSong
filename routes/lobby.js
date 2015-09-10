/**
 * Created by Федор on 09.09.2015.
 */
var express = require('express');
var router = express.Router();

var path = require('path');
var room_controller = require(path.join(__base, 'source', 'room_controller.js'))

/* GET home page. */

router.get('/', function(req, res, next) {
	console.log(room_controller.rooms)
    res.render('lobby', { rooms:room_controller.getRoomList() });
});

// NOT IMPLEMENTED
router.get('/create', function(req, res, next) { 
	room_controller.createRoom('a', 'b', 'c');
	res.redirect('/lobby');	
});

module.exports = router;