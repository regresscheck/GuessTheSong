var tocUtils = require('./mp3-toc-utils');
var models = require('./../models');

module.exports.generateAllTocs = generateAllTocs;
module.exports.roomIdToString = roomIdToString;
module.exports.isLoggedIn = isLoggedIn;
module.exports.syncLoop = syncLoop;
module.exports.getRandomInt = getRandomInt;
module.exports.generateTocForSong = generateTocForSong;

function roomIdToString(id) {
    return 'r' + id.toString();
}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function syncLoop(iterations, process, exit) {
    var index = 0,
        done = false,
        shouldExit = false;
    var loop = {
        next:function(){
            if(done){
                if(shouldExit && exit){
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if(index < iterations){
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
                // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if(exit) exit(); // Call the callback on exit
            }
        },
        iteration:function(){
            return index - 1; // Return the loop number we're on
        },
        break:function(end){
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    loop.next();
    return loop;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function generateTocForSong(filename) {
    var tocPath = filename.replace('.mp3', '.toc');
    tocUtils.generate('./songs/' + filename, function(buffer) {
        require("fs").writeFileSync('./toc/' + tocPath, buffer);
    })
}

function generateAllTocs() {
    models.Song.findAll().then(function(songs) {
        songs.forEach(function(song) {
            generateTocForSong(song.filename);
            console.log(song.filename);
        });
    });
}