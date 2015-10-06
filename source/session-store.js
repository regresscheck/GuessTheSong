var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis').createClient();

module.exports = new RedisStore({
    client: redis
});