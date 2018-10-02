(function(root, factory) {
  if (typeof define === 'function' && define.amd && typeof define.amd == 'object' && define['amd']) {
    // factory is called  with "$__exports" in the case where "exports" is required by AMD, OR when using AMD "function" form
    define(['require', 'exports', 'cjs.js'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.wAnalytics = factory();
  }
}(this, function(require, exports) {
  require('cjs.js');
  exports.umd = 'detection';
}));
