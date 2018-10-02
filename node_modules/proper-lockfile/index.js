'use strict';

var fs = require('graceful-fs');
var path = require('path');
var extend = require('extend');
var errcode = require('err-code');
var retry = require('retry');
var syncFs = require('./lib/syncFs');

var locks = {};

function getLockFile(file) {
    return file + '.lock';
}

function canonicalPath(file, options, callback) {
    if (!options.realpath) {
        return callback(null, path.resolve(file));
    }

    // Use realpath to resolve symlinks
    // It also resolves relative paths
    options.fs.realpath(file, callback);
}

function acquireLock(file, options, callback) {
    // Use mkdir to create the lockfile (atomic operation)
    options.fs.mkdir(getLockFile(file), function (err) {
        // If successful, we are done
        if (!err) {
            return callback();
        }

        // If error is not EEXIST then some other error occurred while locking
        if (err.code !== 'EEXIST') {
            return callback(err);
        }

        // Otherwise, check if lock is stale by analyzing the file mtime
        if (options.stale <= 0) {
            return callback(errcode('Lock file is already being hold', 'ELOCKED', { file: file }));
        }

        options.fs.stat(getLockFile(file), function (err, stat) {
            if (err) {
                // Retry if the lockfile has been removed (meanwhile)
                // Skip stale check to avoid recursiveness
                if (err.code === 'ENOENT') {
                    return acquireLock(file, extend({}, options, { stale: 0 }), callback);
                }

                return callback(err);
            }

            if (!isLockStale(stat, options)) {
                return callback(errcode('Lock file is already being hold', 'ELOCKED', { file: file }));
            }

            // If it's stale, remove it and try again!
            // Skip stale check to avoid recursiveness
            removeLock(file, options, function (err) {
                if (err) {
                    return callback(err);
                }

                acquireLock(file, extend({}, options, { stale: 0 }), callback);
            });
        });
    });
}

function isLockStale(stat, options) {
    return stat.mtime.getTime() < Date.now() - options.stale;
}

function removeLock(file, options, callback) {
    // Remove lockfile, ignoring ENOENT errors
    options.fs.rmdir(getLockFile(file), function (err) {
        if (err && err.code !== 'ENOENT') {
            return callback(err);
        }

        callback();
    });
}

function updateLock(file, options) {
    var lock = locks[file];

    /* istanbul ignore next */
    if (lock.updateTimeout) {
        return;
    }

    lock.updateDelay = lock.updateDelay || options.update;
    lock.updateTimeout = setTimeout(function () {
        var mtime = Date.now() / 1000;

        lock.updateTimeout = null;

        options.fs.utimes(getLockFile(file), mtime, mtime, function (err) {
            // Ignore if the lock was released
            if (lock.released) {
                return;
            }

            // Verify if we are within the stale threshold
            if (lock.lastUpdate <= Date.now() - options.stale &&
                lock.lastUpdate > Date.now() - options.stale * 2) {
                return compromisedLock(file, lock,
                    errcode(lock.updateError || 'Unable to update lock within the stale threshold', 'ECOMPROMISED'));
            }

            // If the file is older than (stale * 2), we assume the clock is moved manually,
            // which we consider a valid case

            // If it failed to update the lockfile, keep trying unless
            // the lockfile was deleted!
            if (err) {
                if (err.code === 'ENOENT') {
                    return compromisedLock(file, lock, errcode(err, 'ECOMPROMISED'));
                }

                lock.updateError = err;
                lock.updateDelay = 1000;
                return updateLock(file, options);
            }

            // All ok, keep updating..
            lock.lastUpdate = Date.now();
            lock.updateError = null;
            lock.updateDelay = null;
            updateLock(file, options);
        });
    }, lock.updateDelay);

    // Unref the timer so that the nodejs process can exit freely
    // This is safe because all acquired locks will be automatically released
    // on process exit
    lock.updateTimeout.unref();
}

function compromisedLock(file, lock, err) {
    lock.released = true;                                    // Signal the lock has been released
    /* istanbul ignore next */
    lock.updateTimeout && clearTimeout(lock.updateTimeout);  // Cancel lock mtime update

    if (locks[file] === lock) {
        delete locks[file];
    }

    lock.compromised(err);
}

// -----------------------------------------

function lock(file, options, compromised, callback) {
    if (typeof options === 'function') {
        callback = compromised;
        compromised = options;
        options = null;
    }

    if (!callback) {
        callback = compromised;
        compromised = null;
    }

    options = extend({
        stale: 10000,
        update: null,
        realpath: true,
        retries: 0,
        fs: fs,
    }, options);

    options.retries = options.retries || 0;
    options.retries = typeof options.retries === 'number' ? { retries: options.retries } : options.retries;
    options.stale = Math.max(options.stale || 0, 2000);
    options.update = options.update == null ? options.stale / 2 : options.update || 0;
    options.update = Math.max(Math.min(options.update, options.stale / 2), 1000);
    compromised = compromised || function (err) { throw err; };

    // Resolve to a canonical file path
    canonicalPath(file, options, function (err, file) {
        var operation;

        if (err) {
            return callback(err);
        }

        // Attempt to acquire the lock
        operation = retry.operation(options.retries);
        operation.attempt(function () {
            acquireLock(file, options, function (err) {
                var lock;

                if (operation.retry(err)) {
                    return;
                }

                if (err) {
                    return callback(operation.mainError());
                }

                // We now own the lock
                locks[file] = lock = {
                    options: options,
                    compromised: compromised,
                    lastUpdate: Date.now(),
                };

                // We must keep the lock fresh to avoid staleness
                updateLock(file, options);

                callback(null, function (releasedCallback) {
                    if (lock.released) {
                        return releasedCallback && releasedCallback(errcode('Lock is already released', 'ERELEASED'));
                    }

                    // Not necessary to use realpath twice when unlocking
                    unlock(file, extend({}, options, { realpath: false }), releasedCallback);
                });
            });
        });
    });
}

function unlock(file, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }

    options = extend({
        fs: fs,
        realpath: true,
    }, options);

    callback = callback || function () {};

    // Resolve to a canonical file path
    canonicalPath(file, options, function (err, file) {
        var lock;

        if (err) {
            return callback(err);
        }

        // Skip if the lock is not acquired
        lock = locks[file];
        if (!lock) {
            return callback(errcode('Lock is not acquired/owned by you', 'ENOTACQUIRED'));
        }

        lock.updateTimeout && clearTimeout(lock.updateTimeout);  // Cancel lock mtime update
        lock.released = true;                                    // Signal the lock has been released
        delete locks[file];                                      // Delete from locks

        removeLock(file, options, callback);
    });
}

function lockSync(file, options, compromised) {
    var err;
    var release;

    if (typeof options === 'function') {
        compromised = options;
        options = null;
    }

    options = options || {};
    options.fs = syncFs(options.fs || fs);
    options.retries = options.retries || 0;
    options.retries = typeof options.retries === 'number' ? { retries: options.retries } : options.retries;

    // Retries are not allowed because it requires the flow to be sync
    if (options.retries.retries) {
        throw errcode('Cannot use retries with the sync api', 'ESYNC');
    }

    lock(file, options, compromised, function (_err, _release) {
        err = _err;
        release = _release;
    });

    if (err) {
        throw err;
    }

    return release;
}

function unlockSync(file, options) {
    var err;

    options = options || {};
    options.fs = syncFs(options.fs || fs);

    unlock(file, options, function (_err) {
        err = _err;
    });

    if (err) {
        throw err;
    }
}

function check(file, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }

    options = extend({
        stale: 10000,
        realpath: true,
        fs: fs,
    }, options);

    options.stale = Math.max(options.stale || 0, 2000);

    // Resolve to a canonical file path
    canonicalPath(file, options, function (err, file) {
        if (err) {
            return callback(err);
        }

        // Check if lockfile exists
        options.fs.stat(getLockFile(file), function (err, stat) {
            if (err) {
                // if does not exist, file is not locked. Otherwise, callback with error
                return (err.code === 'ENOENT') ? callback(null, false) : callback(err);
            }

            if (options.stale <= 0) { return callback(null, true); }

            // Otherwise, check if lock is stale by analyzing the file mtime
            return callback(null, !isLockStale(stat, options));
        });
    });
}

function checkSync(file, options) {
    var err;
    var locked;

    options = options || {};
    options.fs = syncFs(options.fs || fs);

    check(file, options, function (_err, _locked) {
        err = _err;
        locked = _locked;
    });

    if (err) {
        throw err;
    }

    return locked;
}


// Remove acquired locks on exit
/* istanbul ignore next */
process.on('exit', function () {
    Object.keys(locks).forEach(function (file) {
        try { locks[file].options.fs.rmdirSync(getLockFile(file)); } catch (e) { /* empty */ }
    });
});

module.exports = lock;
module.exports.lock = lock;
module.exports.unlock = unlock;
module.exports.lockSync = lockSync;
module.exports.unlockSync = unlockSync;
module.exports.check = check;
module.exports.checkSync = checkSync;
