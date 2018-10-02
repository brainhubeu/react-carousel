'use strict';

(function () {

  if (typeof require != 'undefined' && eval('typeof require') != 'undefined') {
    exports.cjs = true;
  }

  if (false) {
    require('foo');
    require('bar/');
    require('some' + 'expression');
  }
})();
