SystemJS.registerDynamic('foobar', ['bar'], true, function ($__require, exports, module) {
  var f = $__require('foo');
  var global = this || self,
      GLOBAL = global;
  exports.asdf = { obj: 'x' };

  (function (exports) {
    this.another = 'y';

    exports.p = 'q';
  }).call(exports.asdf, exports);
});
