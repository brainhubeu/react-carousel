System.registerDynamic(['./first.js', './second.js'], false, function ($__require, $__exports, $__module) {
  $__module.uri = $__module.id;
  return (function (first, second, require, module) {

    module.exports = {
      first: first,
      second: require('./second.js'),
      utfChar: '\u221e'
    };

    if (DEBUG) {
      console.log('debug mode');
    }
  }).call(this, $__require('./first.js'), $__require('./second.js'), $__require, $__module);
});
