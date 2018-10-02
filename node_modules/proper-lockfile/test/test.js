'use strict';

var fs = require('graceful-fs');
var path = require('path');
var cp = require('child_process');
var expect = require('expect.js');
var extend = require('extend');
var rimraf = require('rimraf');
var spawn = require('buffered-spawn');
var async = require('async');
var lockfile = require('../');

var lockfileContents = fs.readFileSync(__dirname + '/../index.js').toString();
var tmpFileRealPath = path.join(__dirname, 'tmp');
var tmpFile = path.relative(process.cwd(), tmpFileRealPath);
var tmpFileLock = tmpFileRealPath + '.lock';
var tmpFileSymlinkRealPath = tmpFileRealPath + '_symlink';
var tmpFileSymlink = tmpFile + '_symlink';
var tmpFileSymlinkLock = tmpFileSymlinkRealPath + '.lock';
var tmpNonExistentFile = path.join(__dirname, 'nonexistentfile');

function clearLocks(callback) {
    var toUnlock = [];

    toUnlock.push(function (callback) {
        lockfile.unlock(tmpFile, { realpath: false }, function (err) {
            callback(!err || err.code === 'ENOTACQUIRED' ? null : err);
        });
    });

    toUnlock.push(function (callback) {
        lockfile.unlock(tmpNonExistentFile, { realpath: false }, function (err) {
            callback(!err || err.code === 'ENOTACQUIRED' ? null : err);
        });
    });

    toUnlock.push(function (callback) {
        lockfile.unlock(tmpFileSymlink, { realpath: false }, function (err) {
            callback(!err || err.code === 'ENOTACQUIRED' ? null : err);
        });
    });

    if (fs.existsSync(tmpFileSymlink)) {
        toUnlock.push(function (callback) {
            lockfile.unlock(tmpFileSymlink, function (err) {
                callback(!err || err.code === 'ENOTACQUIRED' ? null : err);
            });
        });
    }

    async.parallel(toUnlock, function (err) {
        if (err) {
            return callback(err);
        }

        rimraf.sync(tmpFile);
        rimraf.sync(tmpFileLock);
        rimraf.sync(tmpFileSymlink);
        rimraf.sync(tmpFileSymlinkLock);

        callback();
    });
}

describe('.lock()', function () {
    beforeEach(function () {
        fs.writeFileSync(tmpFile, '');
        rimraf.sync(tmpFileSymlink);
    });

    afterEach(clearLocks);

    this.timeout(5000);

    it('should fail if the file does not exist by default', function (next) {
        lockfile.lock(tmpNonExistentFile, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ENOENT');

            next();
        });
    });

    it('should not fail if the file does not exist and realpath is false', function (next) {
        lockfile.lock(tmpNonExistentFile, { realpath: false }, function (err) {
            expect(err).to.not.be.ok();

            next();
        });
    });

    it('should fail if impossible to create the lockfile', function (next) {
        lockfile.lock('nonexistentdir/nonexistentfile', { realpath: false }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ENOENT');

            next();
        });
    });

    it('should create the lockfile', function (next) {
        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();
            expect(fs.existsSync(tmpFileLock)).to.be(true);

            next();
        });
    });

    it('should fail if already locked', function (next) {
        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.lock(tmpFile, function (err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.be('ELOCKED');
                expect(err.file).to.be(tmpFileRealPath);

                next();
            });
        });
    });

    it('should retry several times if retries were specified', function (next) {
        this.timeout(10000);

        lockfile.lock(tmpFile, function (err, unlock) {
            expect(err).to.not.be.ok();

            setTimeout(unlock, 4000);

            lockfile.lock(tmpFile, { retries: { retries: 5, maxTimeout: 1000 } }, function (err) {
                expect(err).to.not.be.ok();

                next();
            });
        });
    });

    it('should use the custom fs', function (next) {
        var customFs = extend({}, fs);

        customFs.realpath = function (path, callback) {
            customFs.realpath = fs.realpath;
            callback(new Error('foo'));
        };

        lockfile.lock(tmpFile, { fs: customFs }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.be('foo');

            next();
        });
    });

    it('should resolve symlinks by default', function (next) {
        // Create a symlink to the tmp file
        fs.symlinkSync(tmpFileRealPath, tmpFileSymlinkRealPath);

        lockfile.lock(tmpFileSymlink, function (err) {
            expect(err).to.not.be.ok();

            lockfile.lock(tmpFile, function (err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.be('ELOCKED');

                lockfile.lock(tmpFile + '/../../test/tmp', function (err) {
                    expect(err).to.be.an(Error);
                    expect(err.code).to.be('ELOCKED');

                    next();
                });
            });
        });
    });

    it('should not resolve symlinks if realpath is false', function (next) {
        // Create a symlink to the tmp file
        fs.symlinkSync(tmpFileRealPath, tmpFileSymlinkRealPath);

        lockfile.lock(tmpFileSymlink, { realpath: false }, function (err) {
            expect(err).to.not.be.ok();

            lockfile.lock(tmpFile, { realpath: false }, function (err) {
                expect(err).to.not.be.ok();

                lockfile.lock(tmpFile + '/../../test/tmp', { realpath: false }, function (err) {
                    expect(err).to.be.an(Error);
                    expect(err.code).to.be('ELOCKED');

                    next();
                });
            });
        });
    });

    it('should remove and acquire over stale locks', function (next) {
        var mtime = (Date.now() - 60000) / 1000;

        fs.mkdirSync(tmpFileLock);
        fs.utimesSync(tmpFileLock, mtime, mtime);

        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();
            expect(fs.statSync(tmpFileLock).mtime.getTime()).to.be.greaterThan(Date.now() - 3000);

            next();
        });
    });

    it('should retry if the lockfile was removed when verifying staleness', function (next) {
        var mtime = (Date.now() - 60000) / 1000;
        var customFs = extend({}, fs);

        customFs.stat = function (path, callback) {
            rimraf.sync(tmpFileLock);
            fs.stat(path, callback);
            customFs.stat = fs.stat;
        };

        fs.mkdirSync(tmpFileLock);
        fs.utimesSync(tmpFileLock, mtime, mtime);

        lockfile.lock(tmpFile, { fs: customFs }, function (err) {
            expect(err).to.not.be.ok();
            expect(fs.statSync(tmpFileLock).mtime.getTime()).to.be.greaterThan(Date.now() - 3000);

            next();
        });
    });

    it('should retry if the lockfile was removed when verifying staleness (not recursively)', function (next) {
        var mtime = (Date.now() - 60000) / 1000;
        var customFs = extend({}, fs);

        customFs.stat = function (path, callback) {
            var err;

            err = new Error();
            err.code = 'ENOENT';

            return callback(err);
        };

        fs.mkdirSync(tmpFileLock);
        fs.utimesSync(tmpFileLock, mtime, mtime);

        lockfile.lock(tmpFile, { fs: customFs }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ELOCKED');

            next();
        });
    });

    it('should fail if stating the lockfile errors out when verifying staleness', function (next) {
        var mtime = (Date.now() - 60000) / 1000;
        var customFs = extend({}, fs);

        customFs.stat = function (path, callback) {
            callback(new Error('foo'));
        };

        fs.mkdirSync(tmpFileLock);
        fs.utimesSync(tmpFileLock, mtime, mtime);

        lockfile.lock(tmpFile, { fs: customFs }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.be('foo');

            next();
        });
    });

    it('should fail if removing a stale lockfile errors out', function (next) {
        var mtime = (Date.now() - 60000) / 1000;
        var customFs = extend({}, fs);

        customFs.rmdir = function (path, callback) {
            callback(new Error('foo'));
        };

        fs.mkdirSync(tmpFileLock);
        fs.utimesSync(tmpFileLock, mtime, mtime);

        lockfile.lock(tmpFile, { fs: customFs }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.be('foo');

            next();
        });
    });

    it('should update the lockfile mtime automatically', function (next) {
        lockfile.lock(tmpFile, { update: 1000 }, function (err) {
            var mtime;

            expect(err).to.not.be.ok();

            mtime = fs.statSync(tmpFileLock).mtime;

            // First update occurs at 1000ms
            setTimeout(function () {
                var stat = fs.statSync(tmpFileLock);

                expect(stat.mtime.getTime()).to.be.greaterThan(mtime.getTime());
                mtime = stat.mtime;
            }, 1500);

            // Second update occurs at 2000ms
            setTimeout(function () {
                var stat = fs.statSync(tmpFileLock);

                expect(stat.mtime.getTime()).to.be.greaterThan(mtime.getTime());
                mtime = stat.mtime;

                next();
            }, 2500);
        });
    });

    it('should set stale to a minimum of 2000', function (next) {
        fs.mkdirSync(tmpFileLock);

        setTimeout(function () {
            lockfile.lock(tmpFile, { stale: 100 }, function (err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.be('ELOCKED');
            });
        }, 200);

        setTimeout(function () {
            lockfile.lock(tmpFile, { stale: 100 }, function (err) {
                expect(err).to.not.be.ok();

                next();
            });
        }, 2200);
    });

    it('should set stale to a minimum of 2000 (falsy)', function (next) {
        fs.mkdirSync(tmpFileLock);

        setTimeout(function () {
            lockfile.lock(tmpFile, { stale: false }, function (err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.be('ELOCKED');
            });
        }, 200);

        setTimeout(function () {
            lockfile.lock(tmpFile, { stale: false }, function (err) {
                expect(err).to.not.be.ok();

                next();
            });
        }, 2200);
    });

    it('should call the compromised function if ENOENT was detected when updating the lockfile mtime', function (next) {
        lockfile.lock(tmpFile, { update: 1000 }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ECOMPROMISED');
            expect(err.message).to.contain('ENOENT');

            lockfile.lock(tmpFile, function (err) {
                expect(err).to.not.be.ok();

                next();
            }, next);
        }, function (err) {
            expect(err).to.not.be.ok();

            rimraf.sync(tmpFileLock);
        });
    });

    it('should call the compromised function if failed to update the lockfile mtime too many times', function (next) {
        var customFs = extend({}, fs);

        customFs.utimes = function (path, atime, mtime, callback) {
            callback(new Error('foo'));
        };

        this.timeout(10000);

        lockfile.lock(tmpFile, { fs: customFs, update: 1000, stale: 5000 }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.contain('foo');
            expect(err.code).to.be('ECOMPROMISED');

            next();
        }, function (err) {
            expect(err).to.not.be.ok();
        });
    });

    it('should call the compromised function if updating the lockfile took too much time', function (next) {
        var customFs = extend({}, fs);

        customFs.utimes = function (path, atime, mtime, callback) {
            setTimeout(function () {
                callback(new Error('foo'));
            }, 6000);
        };

        this.timeout(10000);

        lockfile.lock(tmpFile, { fs: customFs, update: 1000, stale: 5000 }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ECOMPROMISED');
            expect(err.message).to.contain('threshold');
            expect(fs.existsSync(tmpFileLock)).to.be(true);

            next();
        }, function (err) {
            expect(err).to.not.be.ok();
        });
    });

    it('should call the compromised function if lock was acquired by someone else due to staleness', function (next) {
        var customFs = extend({}, fs);

        customFs.utimes = function (path, atime, mtime, callback) {
            setTimeout(function () {
                callback(new Error('foo'));
            }, 6000);
        };

        this.timeout(10000);

        lockfile.lock(tmpFile, { fs: customFs, update: 1000, stale: 5000 }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ECOMPROMISED');
            expect(fs.existsSync(tmpFileLock)).to.be(true);

            next();
        }, function (err) {
            expect(err).to.not.be.ok();

            setTimeout(function () {
                lockfile.lock(tmpFile, { stale: 5000 }, function (err) {
                    expect(err).to.not.be.ok();
                });
            }, 5500);
        });
    });

    it('should throw an error by default when the lock is compromised', function (next) {
        var originalException;

        this.timeout(10000);

        originalException = process.listeners('uncaughtException').pop();
        process.removeListener('uncaughtException', originalException);

        process.once('uncaughtException', function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ECOMPROMISED');

            process.nextTick(function () {
                process.on('uncaughtException', originalException);
                next();
            });
        });

        lockfile.lock(tmpFile, { update: 1000 }, function (err) {
            expect(err).to.not.be.ok();

            rimraf.sync(tmpFileLock);
        });
    });

    it('should set update to a minimum of 1000', function (next) {
        lockfile.lock(tmpFile, { update: 100 }, function (err) {
            var mtime = fs.statSync(tmpFileLock).mtime.getTime();

            expect(err).to.not.be.ok();

            setTimeout(function () {
                expect(mtime).to.equal(fs.statSync(tmpFileLock).mtime.getTime());
            }, 200);

            setTimeout(function () {
                expect(fs.statSync(tmpFileLock).mtime.getTime()).to.be.greaterThan(mtime);

                next();
            }, 1200);
        });
    });

    it('should set update to a minimum of 1000 (falsy)', function (next) {
        lockfile.lock(tmpFile, { update: false }, function (err) {
            var mtime = fs.statSync(tmpFileLock).mtime.getTime();

            expect(err).to.not.be.ok();

            setTimeout(function () {
                expect(mtime).to.equal(fs.statSync(tmpFileLock).mtime.getTime());
            }, 200);

            setTimeout(function () {
                expect(fs.statSync(tmpFileLock).mtime.getTime()).to.be.greaterThan(mtime);

                next();
            }, 1200);
        });
    });

    it('should set update to a maximum of stale / 2', function (next) {
        lockfile.lock(tmpFile, { update: 6000, stale: 5000 }, function (err) {
            var mtime = fs.statSync(tmpFileLock).mtime.getTime();

            expect(err).to.not.be.ok();

            setTimeout(function () {
                expect(fs.statSync(tmpFileLock).mtime.getTime()).to.equal(mtime);
            }, 2000);

            setTimeout(function () {
                expect(fs.statSync(tmpFileLock).mtime.getTime()).to.be.greaterThan(mtime);

                next();
            }, 3000);
        });
    });
});

describe('.unlock()', function () {
    beforeEach(function () {
        fs.writeFileSync(tmpFile, '');
        rimraf.sync(tmpFileSymlink);
    });

    afterEach(clearLocks);

    this.timeout(5000);

    it('should fail if the lock is not acquired', function (next) {
        lockfile.unlock(tmpFile, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ENOTACQUIRED');

            next();
        });
    });

    it('should release the lock', function (next) {
        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.unlock(tmpFile, function (err) {
                expect(err).to.not.be.ok();

                lockfile.lock(tmpFile, function (err) {
                    expect(err).to.not.be.ok();

                    next();
                });
            });
        });
    });

    it('should release the lock (without callback)', function (next) {
        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.unlock(tmpFile);

            setTimeout(function () {
                lockfile.lock(tmpFile, function (err) {
                    expect(err).to.not.be.ok();

                    next();
                });
            }, 2000);
        });
    });

    it('should remove the lockfile', function (next) {
        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();
            expect(fs.existsSync(tmpFileLock)).to.be(true);

            lockfile.unlock(tmpFile, function (err) {
                expect(err).to.not.be.ok();
                expect(fs.existsSync(tmpFileLock)).to.be(false);

                next();
            });
        });
    });

    it('should fail if removing the lockfile errors out', function (next) {
        var customFs = extend({}, fs);

        customFs.rmdir = function (path, callback) {
            callback(new Error('foo'));
        };

        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.unlock(tmpFile, { fs: customFs }, function (err) {
                expect(err).to.be.an(Error);
                expect(err.message).to.be('foo');

                next();
            });
        });
    });

    it('should ignore ENOENT errors when removing the lockfile', function (next) {
        var customFs = extend({}, fs);
        var called;

        customFs.rmdir = function (path, callback) {
            called = true;
            rimraf.sync(path);
            fs.rmdir(path, callback);
        };

        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.unlock(tmpFile, { fs: customFs }, function (err) {
                expect(err).to.not.be.ok();
                expect(called).to.be(true);

                next();
            });
        });
    });

    it('should stop updating the lockfile mtime', function (next) {
        this.timeout(10000);

        lockfile.lock(tmpFile, { update: 2000 }, function (err) {
            expect(err).to.not.be.ok();

            lockfile.unlock(tmpFile, function (err) {
                expect(err).to.not.be.ok();

                // First update occurs at 2000ms
                setTimeout(next, 2500);
            });
        });
    });

    it('should stop updating the lockfile mtime (slow fs)', function (next) {
        var customFs = extend({}, fs);

        customFs.utimes = function (path, atime, mtime, callback) {
            setTimeout(fs.utimes.bind(fs, path, atime, mtime, callback), 2000);
        };

        this.timeout(10000);

        lockfile.lock(tmpFile, { fs: customFs, update: 2000 }, function (err) {
            expect(err).to.not.be.ok();

            setTimeout(function () {
                lockfile.unlock(tmpFile, function (err) {
                    expect(err).to.not.be.ok();
                });
            }, 3000);

            setTimeout(next, 6000);
        });
    });

    it('should stop updating the lockfile mtime (slow fs + new lock)', function (next) {
        var customFs = extend({}, fs);

        customFs.utimes = function (path, atime, mtime, callback) {
            setTimeout(fs.utimes.bind(fs, path, atime, mtime, callback), 2000);
        };

        this.timeout(10000);

        lockfile.lock(tmpFile, { fs: customFs, update: 2000 }, function (err) {
            expect(err).to.not.be.ok();

            setTimeout(function () {
                lockfile.unlock(tmpFile, function (err) {
                    expect(err).to.not.be.ok();

                    lockfile.lock(tmpFile, function (err) {
                        expect(err).to.not.be.ok();
                    });
                });
            }, 3000);

            setTimeout(next, 6000);
        });
    });

    it('should resolve to a canonical path', function (next) {
        // Create a symlink to the tmp file
        fs.symlinkSync(tmpFileRealPath, tmpFileSymlinkRealPath);

        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.unlock(tmpFile, function (err) {
                expect(err).to.not.be.ok();
                expect(fs.existsSync(tmpFileLock)).to.be(false);

                next();
            });
        });
    });

    it('should use the custom fs', function (next) {
        var customFs = extend({}, fs);

        customFs.realpath = function (path, callback) {
            customFs.realpath = fs.realpath;
            callback(new Error('foo'));
        };

        lockfile.unlock(tmpFile, { fs: customFs }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.be('foo');

            next();
        });
    });
});

describe('.check()', function () {
    beforeEach(function () {
        fs.writeFileSync(tmpFile, '');
        rimraf.sync(tmpFileSymlink);
    });

    afterEach(clearLocks);

    this.timeout(5000);

    it('should fail if the file does not exist by default', function (next) {
        lockfile.check(tmpNonExistentFile, function (err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.be('ENOENT');

            next();
        });
    });

    it('should not fail if the file does not exist and realpath is false', function (next) {
        lockfile.check(tmpNonExistentFile, { realpath: false }, function (err) {
            expect(err).to.not.be.ok();

            next();
        });
    });

    it('should callback with true if file is locked', function (next) {
        lockfile.lock(tmpFile, function (err) {
            expect(err).to.not.be.ok();

            lockfile.check(tmpFile, function (err, locked) {
                expect(err).to.not.be.ok();
                expect(locked).to.be(true);
                next();
            });
        });
    });

    it('should callback with false if file is not locked', function (next) {
        lockfile.check(tmpFile, function (err, locked) {
            expect(err).to.not.be.ok();
            expect(locked).to.be(false);
            next();
        });
    });

    it('should use the custom fs', function (next) {
        var customFs = extend({}, fs);

        customFs.realpath = function (path, callback) {
            customFs.realpath = fs.realpath;
            callback(new Error('foo'));
        };

        lockfile.check(tmpFile, { fs: customFs }, function (err, locked) {
            expect(err).to.be.an(Error);
            expect(locked).to.be(undefined);

            next();
        });
    });

    it('should resolve symlinks by default', function (next) {
        // Create a symlink to the tmp file
        fs.symlinkSync(tmpFileRealPath, tmpFileSymlinkRealPath);

        lockfile.lock(tmpFileSymlink, function (err) {
            expect(err).to.not.be.ok();

            lockfile.check(tmpFile, function (err, locked) {
                expect(err).to.not.be.ok();
                expect(locked).to.be(true);

                lockfile.check(tmpFile + '/../../test/tmp', function (err, locked) {
                    expect(err).to.not.be.ok();
                    expect(locked).to.be(true);
                    next();
                });
            });
        });
    });

    it('should not resolve symlinks if realpath is false', function (next) {
        // Create a symlink to the tmp file
        fs.symlinkSync(tmpFileRealPath, tmpFileSymlinkRealPath);

        lockfile.lock(tmpFileSymlink, { realpath: false }, function (err) {
            expect(err).to.not.be.ok();

            lockfile.check(tmpFile, { realpath: false }, function (err, locked) {
                expect(err).to.not.be.ok();
                expect(locked).to.be(false);

                lockfile.check(tmpFile + '/../../test/tmp', { realpath: false }, function (err, locked) {
                    expect(err).to.not.be.ok();
                    expect(locked).to.be(false);

                    next();
                });
            });
        });
    });

    it('should fail if stating the lockfile errors out when verifying staleness', function (next) {
        var mtime = (Date.now() - 60000) / 1000;
        var customFs = extend({}, fs);

        customFs.stat = function (path, callback) {
            callback(new Error('foo'));
        };

        fs.mkdirSync(tmpFileLock);
        fs.utimesSync(tmpFileLock, mtime, mtime);

        lockfile.check(tmpFile, { fs: customFs }, function (err, locked) {
            expect(err).to.be.an(Error);
            expect(err.message).to.be('foo');
            expect(locked).to.be(undefined);

            next();
        });
    });

    it('should set stale to a minimum of 2000', function (next) {
        fs.mkdirSync(tmpFileLock);

        setTimeout(function () {
            lockfile.lock(tmpFile, { stale: 2000 }, function (err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.be('ELOCKED');
            });
        }, 200);

        setTimeout(function () {
            lockfile.check(tmpFile, { stale: 100 }, function (err, locked) {
                expect(err).to.not.be.ok();
                expect(locked).to.equal(false);

                next();
            });
        }, 2200);
    });

    it('should set stale to a minimum of 2000 (falsy)', function (next) {
        fs.mkdirSync(tmpFileLock);

        setTimeout(function () {
            lockfile.lock(tmpFile, { stale: 2000 }, function (err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.be('ELOCKED');
            });
        }, 200);

        setTimeout(function () {
            lockfile.check(tmpFile, { stale: false }, function (err, locked) {
                expect(err).to.not.be.ok();
                expect(locked).to.equal(false);

                next();
            });
        }, 2200);
    });
});

describe('release()', function () {
    beforeEach(function () {
        fs.writeFileSync(tmpFile, '');
    });

    afterEach(clearLocks);

    this.timeout(5000);

    it('should release the lock after calling the provided release function', function (next) {
        lockfile.lock(tmpFile, function (err, release) {
            expect(err).to.not.be.ok();

            release(function (err) {
                expect(err).to.not.be.ok();

                lockfile.lock(tmpFile, function (err) {
                    expect(err).to.not.be.ok();

                    next();
                });
            });
        });
    });

    it('should fail when releasing twice', function (next) {
        lockfile.lock(tmpFile, function (err, release) {
            expect(err).to.not.be.ok();

            release(function (err) {
                expect(err).to.not.be.ok();

                release(function (err) {
                    expect(err).to.be.an(Error);
                    expect(err.code).to.be('ERELEASED');

                    next();
                });
            });
        });
    });
});

describe('sync api', function () {
    beforeEach(function () {
        fs.writeFileSync(tmpFile, '');
        rimraf.sync(tmpFileSymlink);
    });

    afterEach(clearLocks);

    it('should expose a working lockSync', function () {
        var release;

        // Test success
        release = lockfile.lockSync(tmpFile);

        expect(release).to.be.a('function');
        expect(fs.existsSync(tmpFileLock)).to.be(true);
        release();
        expect(fs.existsSync(tmpFileLock)).to.be(false);

        // Test compromise being passed and no options
        release = lockfile.lockSync(tmpFile, function () {});
        expect(fs.existsSync(tmpFileLock)).to.be(true);
        release();
        expect(fs.existsSync(tmpFileLock)).to.be(false);

        // Test options being passed and no compromised
        release = lockfile.lockSync(tmpFile, {});
        expect(fs.existsSync(tmpFileLock)).to.be(true);
        release();
        expect(fs.existsSync(tmpFileLock)).to.be(false);

        // Test both options and compromised being passed
        release = lockfile.lockSync(tmpFile, {}, function () {});
        expect(fs.existsSync(tmpFileLock)).to.be(true);
        release();
        expect(fs.existsSync(tmpFileLock)).to.be(false);

        // Test fail
        lockfile.lockSync(tmpFile);
        expect(function () {
            lockfile.lockSync(tmpFile);
        }).to.throwException(/already being hold/);
    });

    it('should not allow retries to be passed', function () {
        expect(function () {
            lockfile.lockSync(tmpFile, { retries: 10 });
        }).to.throwException(/Cannot use retries/i);

        expect(function () {
            lockfile.lockSync(tmpFile, { retries: { retries: 10 } });
        }).to.throwException(/Cannot use retries/i);

        expect(function () {
            var release = lockfile.lockSync(tmpFile, { retries: 0 });

            release();
        }).to.not.throwException();

        expect(function () {
            var release = lockfile.lockSync(tmpFile, { retries: { retries: 0 } });

            release();
        }).to.not.throwException();
    });

    it('should expose a working unlockSync', function () {
        // Test success
        lockfile.lockSync(tmpFile);
        expect(fs.existsSync(tmpFileLock)).to.be(true);

        lockfile.unlockSync(tmpFile);
        expect(fs.existsSync(tmpFileLock)).to.be(false);

        // Test fail
        expect(function () {
            lockfile.unlockSync(tmpFile);
        }).to.throwException(/not acquired\/owned by you/);
    });

    it('should update the lockfile mtime automatically', function (next) {
        var mtime;

        this.timeout(5000);

        lockfile.lockSync(tmpFile, { update: 1000 });
        mtime = fs.statSync(tmpFileLock).mtime;

        // First update occurs at 1000ms
        setTimeout(function () {
            var stat = fs.statSync(tmpFileLock);

            expect(stat.mtime.getTime()).to.be.greaterThan(mtime.getTime());
            mtime = stat.mtime;
        }, 1500);

        // Second update occurs at 2000ms
        setTimeout(function () {
            var stat = fs.statSync(tmpFileLock);

            expect(stat.mtime.getTime()).to.be.greaterThan(mtime.getTime());
            mtime = stat.mtime;

            next();
        }, 2500);
    });

    it('should use a custom fs', function () {
        var customFs = extend({}, fs);
        var called;

        customFs.realpathSync = function () {
            called = true;
            return fs.realpathSync.apply(fs, arguments);
        };

        lockfile.lockSync(tmpFile, { fs: customFs });
        expect(called).to.be(true);
    });

    it('should expose a working checkSync', function () {
        var release;
        var locked;

        // Test success unlocked
        locked = lockfile.checkSync(tmpFile);
        expect(locked).to.be.a('boolean');
        expect(locked).to.be(false);

        // Test success locked
        release = lockfile.lockSync(tmpFile);
        locked = lockfile.checkSync(tmpFile);
        expect(locked).to.be.a('boolean');
        expect(locked).to.be(true);

        // Test success unlocked after release
        release();
        locked = lockfile.checkSync(tmpFile);
        expect(locked).to.be.a('boolean');
        expect(locked).to.be(false);

        // Test options being passed
        locked = lockfile.checkSync(tmpFile, {});
        expect(locked).to.be.a('boolean');
        expect(locked).to.be(false);

        release = lockfile.lockSync(tmpFile);
        locked = lockfile.checkSync(tmpFile, {});
        expect(locked).to.be.a('boolean');
        expect(locked).to.be(true);

        release();
        locked = lockfile.checkSync(tmpFile, {});
        expect(locked).to.be.a('boolean');
        expect(locked).to.be(false);

        // Test fail with non-existent file
        expect(function () {
            lockfile.checkSync('nonexistentdir/nonexistentfile');
        }).to.throwException(/ENOENT/);
    });
});

describe('misc', function () {
    afterEach(clearLocks);

    it('should not contain suspicious nodejs native fs calls', function () {
        expect(/\s{2,}fs\.[a-z]+/i.test(lockfileContents)).to.be(false);
    });

    it('should remove open locks if the process crashes', function (next) {
        cp.exec('node ' + __dirname + '/fixtures/crash.js', function (err, stdout, stderr) {
            if (!err) {
                return next(new Error('Should have failed'));
            }

            if (err.code === 25) {
                return next(new Error('Lock failed'));
            }

            expect(stderr).to.contain('crash');
            expect(fs.existsSync(tmpFileLock)).to.be(false);

            next();
        });
    });

    it('should not hold the process if it has no more work to do', function (next) {
        spawn('node', [__dirname + '/fixtures/unref.js'], next);
    });

    it('should work on stress conditions', function (next) {
        this.timeout(80000);

        spawn('node', [__dirname + '/fixtures/stress.js'], function (err, stdout) {
            if (err) {
                if (process.env.TRAVIS) {
                    process.stdout.write(stdout);
                } else {
                    fs.writeFileSync(__dirname + '/stress.log', stdout);
                }

                return next(err);
            }

            next();
        });
    });
});
