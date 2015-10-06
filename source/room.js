var GameController = require('./game-controller');

function Room(id, name, type, pass){
    this.id = id;
    this.name = name;
    this.type = type;
    this.player_list = [];
    this.gameController = new GameController();
}

Room.prototype.handleMessage = function(user, message) {
    this.gameController.handleMessage(user, message);
};

module.exports = Room;
