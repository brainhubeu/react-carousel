System.registerDynamic([], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, {
    "baz": $__require("qux"),
    "eggs": $__require("bacon")
  });

  (function ($__global) {
    foo = "bar";
  })(this);

  return _retrieveGlobal();
});
