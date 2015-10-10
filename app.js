var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var passport = require('passport');
var session = require('express-session');
var generalSettings = require('./config/general');
var sequelize = require('./models').sequelize;
var sessionStore = require('./source/session-store');


// Initializes Event Emitters
require('./source/chat-controller');

global.__base = __dirname;
winston.level = 'debug';

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./source/socket')(io);


// view engine setupgg
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// app setup
require('./config/passport');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: generalSettings.sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());


// routes setup
var routes = require('./routes/index');
var lobby = require('./routes/lobby');
var auth = require('./routes/auth');
var room = require('./routes/game');
var play = require('./routes/play');

app.use('/', routes);
app.use('/lobby', lobby);
app.use('/auth', auth);
app.use('/game', room);
app.use('/play', play);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log('------------');
        console.log(err.message);
        console.log('------------');
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(3000);
module.exports = app;

