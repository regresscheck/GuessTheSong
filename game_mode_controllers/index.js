// Methods that must be provided by Game Mode:
//   handleMessage(functions, song, user, data), returns "result" object
//   onNewRound
//   onNewGame
// Functions is a map of all available functions:
// 1) endRound - ends round before timer.


module.exports.ClassicMode =  require('./classic-mode');