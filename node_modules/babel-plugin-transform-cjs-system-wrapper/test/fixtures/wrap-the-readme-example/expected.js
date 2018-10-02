System.registerDynamic('foobar', ['bar'], true, function ($__require, exports, module) {
  'use strict';

  var f = $__require('foo');
  var global = this || self,
      GLOBAL = global;
  var foo = $__require('foo');
});
