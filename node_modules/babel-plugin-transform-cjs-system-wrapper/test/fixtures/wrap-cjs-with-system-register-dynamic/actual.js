'use strict';

console.log(__filename);

(function (require) {

  if (typeof require != 'undefined' && eval('typeof require') != 'undefined') {
    exports.cjs = true;
  }

  if (false) {
    require('foo');
    require('bar/');
    require('some' + 'expression');
  }
})(require);

(function (require) {
  require.resolve('raboof');
})(require);

exports.env = process.env.NODE_ENV;
