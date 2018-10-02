System.registerDynamic([], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {
    $__global["baz"] = baz;
    var foo = $__global["foo"];
    var foo = function bar() {};

    function baz() {
      return "qux";
    }
    $__global["foo"] = foo;
  })(this);

  return _retrieveGlobal();
});
