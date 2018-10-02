/* asdf

define({ amd: 2 }); // ?

*/

// factory as an expression
System.registerDynamic([], false, function ($__require, $__exports, $__module) {
  var $__factory = (window.m = { amd: '2' });

  if (typeof $__factory === 'function') {
    return $__factory.call(this);
  } else {
    return $__factory;
  }
});
