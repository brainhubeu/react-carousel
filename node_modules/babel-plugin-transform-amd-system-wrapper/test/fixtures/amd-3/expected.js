System.registerDynamic(['./first.js'], false, function ($__require, $__exports, $__module) {
  $__module.uri = $__module.id;
  return (function (req, exports, module) {
    module.exports = req('./first.js');
  }).call($__exports, $__require, $__exports, $__module);
});
