System.registerDynamic([], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = System.registry.get("@@global-helpers").prepareGlobal($__module.id, "foo", null);

  (function ($__global) {
    foo = "bar";
  })(this);

  return _retrieveGlobal();
});
