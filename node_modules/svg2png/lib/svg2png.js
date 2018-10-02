"use strict";
const path = require("path");
const childProcess = require("pn/child_process");

const phantomjsCmd = require("phantomjs-prebuilt").path;
const converterFileName = path.resolve(__dirname, "./converter.js");

const PREFIX = "data:image/png;base64,";

module.exports = (sourceBuffer, resize) => {
    const cp = childProcess.execFile(phantomjsCmd, getPhantomJSArgs(resize), { maxBuffer: Infinity });

    writeBufferInChunks(cp.stdin, sourceBuffer);

    return cp.promise.then(processResult);
};

module.exports.sync = (sourceBuffer, resize) => {
    const result = childProcess.spawnSync(phantomjsCmd, getPhantomJSArgs(resize), {
        input: sourceBuffer.toString("base64")
    });
    return processResult(result);
}

function getPhantomJSArgs(resize) {
    return [
        converterFileName,
        resize === undefined ? "undefined" : JSON.stringify(resize)
    ];
}

function writeBufferInChunks(writableStream, buffer) {
    const asString = buffer.toString("base64");

    const INCREMENT = 1024;

    writableStream.cork();
    for (let offset = 0; offset < asString.length; offset += INCREMENT) {
        writableStream.write(asString.substring(offset, offset + INCREMENT));
    }
    writableStream.end("\n"); // so that the PhantomJS side can use readLine()
}

function processResult(result) {
    const stdout = result.stdout.toString();
    if (stdout.startsWith(PREFIX)) {
        return new Buffer(stdout.substring(PREFIX.length), "base64");
    }

    if (stdout.length > 0) {
         // PhantomJS always outputs to stdout.
         throw new Error(stdout.replace(/\r/g, "").trim());
    }

    const stderr = result.stderr.toString();
    if (stderr.length > 0) {
        // But hey something else might get to stderr.
        throw new Error(stderr.replace(/\r/g, "").trim());
    }

    throw new Error("No data received from the PhantomJS child process");
}
