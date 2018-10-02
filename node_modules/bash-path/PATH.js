'use strict';

var union = require('arr-union');
var path = require('path');
var defaults = [
  '/bin/bash',
  '/sbin/bash',
  '/usr/bin/bash',
  '/usr/local/bin/bash',
  '/usr/local/sbin/bash',
  '/usr/sbin/bash',
  '/usr/X11/bin/bash',
  '/opt/local/bin',
  '/opt/local/sbin',
  'bash'
];

module.exports = function(compare) {
  var paths = union([], defaults, process.env.PATH.split(path.delimiter));
  if (typeof compare === 'function') {
    paths.sort(compare);
    return paths;
  }
  if (typeof compare === false) {
    return paths;
  }
  paths.sort(comparison);
  return paths;
};

function comparison(a, b) {
  return /use?r\//.test(a) ? -1 : 1;
}
