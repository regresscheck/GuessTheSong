var escape = require('escape-html');
var roomIdToString = require('./misc').roomIdToString;
var passportSocketIo = require('passport.socketio');
var generalSettings = require('./../config/general');
var session = require('express-session');
var sequelize = require('./../models').sequelize;
var SessionStore = require('connect-session-sequelize')(session.Store);

module.exports = function(io) {
    var allClients = [];

    function onAuthorizeSuccess(data, accept) {
        accept();
    }

    function onAuthorizeFail(data, message, error, accept) {
        if (error)
            accept(new Error(message));
    }

    io.use(passportSocketIo.authorize({
        secret: generalSettings.sessionSecret,
        store: new SessionStore({
            db: sequelize
        }),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));
    io.on('connection', function (socket) {
        allClients.push(socket);
        socket.on('disconnect', function () {
            var i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });
        socket.on('join_room', function(data) {
            socket.join(roomIdToString(data.room_id));
        });
        socket.on('message', function(data) {
            io.to(roomIdToString(data.room_id)).emit('message', {
                message: escape(data.message)
            });
        });
    });
};
