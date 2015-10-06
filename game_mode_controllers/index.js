// Methods that must be provided by Game Mode:
// 1) handleMessage(song, user, data), returns "result" object
// 2) handleResult(score), accumulates "result" objects

module.exports.ClassicMode =  require('./classic-mode');