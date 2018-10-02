'use strict';

var cluster = require('cluster');
var fs = require('fs');
var os = require('os');
var rimraf = require('rimraf');
var sort = require('stable');
var lockfile = require('../../');

var file = __dirname + '/../tmp';

function printExcerpt(logs, index) {
    logs.slice(Math.max(0, index - 50), index + 50).forEach(function (log, index) {
        process.stdout.write((index + 1) + ' ' + log.timestamp + ' ' + log.message + '\n');
    });
}

function master() {
    var logs = [];
    var numCPUs = os.cpus().length;
    var i;
    var acquired;

    fs.writeFileSync(file, '');
    rimraf.sync(file + '.lock');

    logs = [];

    for (i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        worker.on('message', function (data) {
            logs.push(data.toString().trim());
        });
    });

    cluster.on('exit', function () {
        throw new Error('Child died prematurely');
    });

    setTimeout(function () {
        cluster.removeAllListeners('exit');

        Object.keys(cluster.workers).forEach(function (id) {
            cluster.workers[id].removeAllListeners('message').kill();
        });

        cluster.disconnect(function () {
            // Parse & sort logs
            logs = logs.map(function (log) {
                var split = log.split(' ');

                return { timestamp: Number(split[0]), message: split[1] };
            });

            logs = sort(logs, function (log1, log2) {
                if (log1.timestamp > log2.timestamp) {
                    return 1;
                }
                if (log1.timestamp < log2.timestamp) {
                    return -1;
                }
                if (log1.message === 'LOCK_RELEASED') {
                    return -1;
                }
                if (log2.message === 'LOCK_RELEASED') {
                    return 1;
                }

                return 0;
            });

            // Validate logs
            logs.forEach(function (log, index) {
                switch (log.message) {
                case 'LOCK_ACQUIRED':
                    if (acquired) {
                        process.stdout.write('\nInconsistent at line ' + (index + 1) + '\n');
                        printExcerpt(logs, index);

                        process.exit(1);
                    }

                    acquired = true;
                    break;
                case 'LOCK_RELEASED':
                    if (!acquired) {
                        process.stdout.write('\nInconsistent at line ' + (index + 1) + '\n');
                        printExcerpt(logs, index);
                        process.exit(1);
                    }

                    acquired = false;
                    break;
                default:
                    // do nothing
                }
            });

            process.exit(0);
        });
    }, 60000);
}

function slave() {
    var tryLock;

    tryLock = function () {
        setTimeout(function () {
            process.send(Date.now() + ' LOCK_TRY');

            lockfile.lock(file, function (err, unlock) {
                if (err) {
                    process.send(Date.now() + ' LOCK_BUSY\n');
                    return tryLock();
                }

                process.send(Date.now() + ' LOCK_ACQUIRED\n');

                setTimeout(function () {
                    process.send(Date.now() + ' LOCK_RELEASED\n');

                    unlock(function (err) {
                        if (err) {
                            throw err;
                        }

                        tryLock();
                    });
                }, Math.random() * 200);
            });
        }, Math.random() * 100);
    };

    tryLock();
}

if (cluster.isMaster) {
    master();
} else {
    slave();
}
