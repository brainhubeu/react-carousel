System.registerDynamic(['./global.js', './some.js!./plugin.js', './text.txt!./text-plugin.js'], false, function ($__require, $__exports, $__module) {
  return (function (a, b, c) {
    return { is: 'amd', text: c };
  }).call(this, $__require('./global.js'), $__require('./some.js!./plugin.js'), $__require('./text.txt!./text-plugin.js'));
});
