'use strict';

function makeSync(fs, name) {
    var fn = fs[name + 'Sync'];

    return function () {
        var callback = arguments[arguments.length - 1];
        var args = Array.prototype.slice.call(arguments, 0, -1);
        var ret;

        try {
            ret = fn.apply(fs, args);
        } catch (err) {
            return callback(err);
        }

        callback(null, ret);
    };
}

function syncFs(fs) {
    var fns = ['mkdir', 'realpath', 'stat', 'rmdir', 'utimes'];
    var obj = {};
    var key;

    // Create the sync versions of the methods that we need
    fns.forEach(function (name) {
        obj[name] = makeSync(fs, name);
    });

    // Copy the rest of the functions
    for (key in fs) {
        if (!obj[key]) {
            obj[key] = fs[key];
        }
    }

    return obj;
}

module.exports = syncFs;
