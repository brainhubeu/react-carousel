(function () {
  var define = System.amdDefine;
  define('a', { a: 'a' });
  define('b', { b: 'b' });
  define("amd-10.js", ["c"], function (c) {
    return c;
  });
  define('c', ['b'], function (b) {
    return {
      b: b,
      c: 'c'
    };
  });
})();

System.registerDynamic(['amd-10.js'], false, function ($__require, $__exports, $__module) {
  return (function (m) {
    return m;
  }).call(this, $__require('amd-10.js'));
});
