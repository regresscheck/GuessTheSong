var fs = require("fs");

var FFPROBE_PATH = "ffprobe";

function ffProbePath(path) {
    FFPROBE_PATH = path;
}

function generate(mediaPath, callback) {
    var spawn = require("child_process").spawn,
        Lazy = require("lazy");

    var probeProc,
        toc = [ ],
        type,
        pos,
        time,
        prevTime = -1;

    resetFrame();

    probeProc = spawn(FFPROBE_PATH, [ "-show_frames", mediaPath ]);

    // http://stackoverflow.com/q/6156501 
    Lazy(probeProc.stdout)
        .on("end", convertToBuffer)
        .lines.forEach(processLine);

    function resetFrame() {
        type = null;
        pos = null;
        time = null;
    }

    function processLine(line) {
        line = String(line).trim();

        if(line === "[FRAME]") {
            resetFrame();
        } else if(line.substr(0, 11) === "media_type=") {
            type = line.substr(11);
        } else if(line.substr(0, 8) === "pkt_pos=") {
            pos = Number(line.substr(8));
        } else if(line.substr(0, 13) === "pkt_dts_time=") {
            time = Number(line.substr(13));
        }

        if(type === "audio" && pos !== null && time !== null && isFinite(pos) && isFinite(time)) {
            time = Math.floor(time);

            if(time !== prevTime) {
                if(time - prevTime !== 1)
                    throw Error("Unexpected time change");

                prevTime = time;
                toc.push(pos);
            }
        }
    }

    function convertToBuffer() {
        var binaryToc = new Buffer(4 * toc.length);
        for(var i = 0; i < toc.length; i++)
            binaryToc.writeUInt32LE(toc[i], 4 * i);

        callback(binaryToc);
    }
}

function posForTime(tocPath, time) {
    var f = fs.openSync(tocPath, "r"),
        buffer = new Buffer(4),
        readCount = fs.readSync(f, buffer, 0, 4, 4 * time);

    fs.closeSync(f);

    if(readCount != 4)
        return -1;

    return buffer.readUInt32LE(0);
}

module.exports = {
    ffProbePath: ffProbePath,
    generate: generate,
    posForTime: posForTime
};