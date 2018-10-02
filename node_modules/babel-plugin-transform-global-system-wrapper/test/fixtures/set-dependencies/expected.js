System.registerDynamic(["baz", "qux"], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {
    foo = "bar";
  })(this);

  return _retrieveGlobal();
});
