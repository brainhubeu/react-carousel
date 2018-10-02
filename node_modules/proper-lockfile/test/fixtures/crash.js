'use strict';

var fs = require('fs');
var lockfile = require('../../');

var file = __dirname + '/../tmp';

fs.writeFileSync(file, '');

lockfile.lock(file, function (err) {
    if (err) {
        process.exit(25);
    }

    throw new Error('crash');
});
