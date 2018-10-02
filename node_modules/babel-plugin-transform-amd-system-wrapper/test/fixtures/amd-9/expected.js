System.registerDynamic('asdf', ['c'], false, function ($__require, $__exports, $__module) {
  return (function (c) {
    return c;
  }).call(this, $__require('c'));
});

System.registerDynamic('a', [], false, function ($__require, $__exports, $__module) {
  return {
    a: 'a'
  };
});

System.registerDynamic('b', [], false, function ($__require, $__exports, $__module) {
  return {
    b: 'b'
  };
});

System.registerDynamic('c', ['b'], false, function ($__require, $__exports, $__module) {
  return (function (b) {
    return {
      b: b,
      c: 'c'
    };
  }).call(this, $__require('b'));
});
