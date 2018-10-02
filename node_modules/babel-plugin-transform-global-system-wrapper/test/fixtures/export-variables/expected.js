System.registerDynamic([], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {
    var foo = $__global["foo"];
    var foo = "bar";

    (function () {
      var baz = "qux";
    })();

    one = 1;
    $__global["foo"] = foo;
  })(this);

  return _retrieveGlobal();
});
