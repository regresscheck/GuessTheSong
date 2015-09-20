var mode = require('./mode.js');
var gc = require('./game_controller.js');
var sc = require('./song_controller.js');
var chat = require('./chat.js');


//
function RoomSettings(name, type, pass) {
    //required
    this.room_name = name;
    this.type = type;
    this.pass = pass;
    //default ones
    this.genre = 0;
    this.player_amount = 0;
    this.max_players = 10;
}
//RoomSettings methods
RoomSettings.prototype.changeSettings = function(genre, player_amount, max_players){
    this.genre = genre;
    this.player_amount = player_amount;
    this.max_players = max_players;
};
function Room(id, name, type, pass){
    this.id = id;
    this.player_list = [];
    this.settings = new RoomSettings(name, type, pass);
    //this.room_gc = new gc.GameController(); UNCOMMENT
    //this.room_sc = new sc.SongController();
    //this.room_chat = new chat.Chat();
}
//Room methods
Room.prototype.startChat = function() {
    //..starts chat
};

Room.prototype.changeSettings = function(genre, player_amount, max_players){
    this.settings.changeSettings(genre, player_amount, max_players);
};

Room.prototype.removeUser = function(user){
    this.settings.player_amount--;
    var i = player_list.indexOf(user);
    player_list.splice(i, 1);
};
Room.prototype.addUser = function(user){
    this.settings.player_amount++;
    this.player_list.push(user);
};

module.exports.Room = Room;
