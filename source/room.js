var mode = require('./mode.js');



function Room(name, type, pass){
    this.room_name = name;
    this.type = type;
    this.pass = pass;

}



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
