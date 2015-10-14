var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis').createClient();

var redisStore = new RedisStore({
    client: redis
});

redisStore.on('error', function(err) {
    console.log('Huynya');
});

module.exports = redisStore;