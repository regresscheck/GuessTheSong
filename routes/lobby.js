/**
 * Created by Федор on 09.09.2015.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Rooms will be there' });
});

module.exports = router;