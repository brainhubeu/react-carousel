(function (root, factory) {
  if ('function' === 'function' && true && 'object' == 'object' && true) {
    // factory is called  with "$__exports" in the case where "exports" is required by AMD, OR when using AMD "function" form
    System.registerDynamic(['cjs.js'], false, function ($__require, $__exports, $__module) {
      if (typeof factory === 'function') {
        return factory.call($__exports, $__require, $__exports, $__require('cjs.js'));
      } else {
        return factory;
      }
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.wAnalytics = factory();
  }
})(this, function (require, exports) {
  require('cjs.js');
  exports.umd = 'detection';
});
