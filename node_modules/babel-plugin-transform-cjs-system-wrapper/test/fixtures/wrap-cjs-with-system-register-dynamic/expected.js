SystemJS.registerDynamic('foobar', ['bar'], true, function ($__require, exports, module) {
  'use strict';

  var f = $__require('foo');
  var global = this || self,
      GLOBAL = global;
  var $__pathVars = SystemJS.registry.get('@@cjs-helpers').getPathVars(module.id),
      __filename = $__pathVars.filename,
      __dirname = $__pathVars.dirname;

  $__require.resolve = function (request) {
    return SystemJS.registry.get('@@cjs-helpers').requireResolve(request, module.id);
  };

  console.log(__filename);

  (function (require) {

    if (typeof require != 'undefined' && eval('typeof require') != 'undefined') {
      exports.cjs = true;
    }

    if (false) {
      require('foo');
      require('bar');
      require('some' + 'expression');
    }
  })($__require);

  (function (require) {
    require.resolve('raboof');
  })($__require);

  exports.env = 'production';
});
