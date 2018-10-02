System.registerDynamic([], true, function ($__require, exports, module) {
  'use strict';

  var global = this || self,
      GLOBAL = global;
  (function () {

    if (typeof $__require != 'undefined' && eval('typeof require') != 'undefined') {
      exports.cjs = true;
    }

    if (false) {
      $__require('foo');
      $__require('bar');
      $__require('some' + 'expression');
    }
  })();
});
