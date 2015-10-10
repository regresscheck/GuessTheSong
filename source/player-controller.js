var Map = require('collections/map');

function equalUsers(first, second) {
    return first.id === second.id;
}

function hashUser(user) {
    return user.id.toString();
}


var players = Map({}, equalUsers, hashUser);
function Player(socketId, socket) {
    this.socketId = socketId;
    this.user = socket.request.user;
    players.set(this.user, this);
}

Player.prototype.toSendable = function() {
    return {
        name: this.user.name
    }
};

Player.equal = function(first, second) {
    return equalUsers(first.user, second.user);
};

Player.hash = function(player) {
    return hashUser(player.user);
};


module.exports.getPlayer = function getPlayer(socketId, socket) {
    if (players.has(socket.request.user)) {
        var player = players.get(socket.request.user);
        player.socketId = socketId;
        return player;
    }
    if (players.keys().length > 0) {
        console.log(players.keys()[0]);
        console.log(equalUsers(players.keys()[0], socket.request.user));
    }
    return new Player(socketId, socket);
};

module.exports.Player = Player;