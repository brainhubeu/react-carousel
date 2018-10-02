var path = require('path');


module.exports = function basename (filepath) { 'use strict';
    return path.basename(filepath, path.extname(filepath));
    };
