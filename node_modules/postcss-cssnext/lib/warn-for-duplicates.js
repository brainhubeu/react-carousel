"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spotted = undefined;

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var msg = function msg(name) {
  return "Warning: postcss-cssnext found a duplicate plugin ('" + name + "') " + "in your postcss plugins. " + ("This might be inefficient. You should remove '" + name + "' from your ") + "postcss plugin list since it's already included by postcss-cssnext.";
};

var shouldGlobalWarn = true;
var globalWarning = "Note: If, for a really specific reason, postcss-cssnext warnings are " + "irrelevant for your use case, and you really know what you are doing, " + "you can disable this warnings by setting  'warnForDuplicates' option of " + "postcss-cssnext to 'false'.";
var spotted = exports.spotted = [];

var warnForDuplicates = _postcss2.default.plugin("postcss-warn-for-duplicates", function (options) {
  return function (style, result) {
    // https://github.com/postcss/postcss/issues/768
    var keys = options.keys,
        messenger = options.console;

    var pluginNames = [];
    result.processor.plugins.forEach(function (plugin) {
      var name = plugin.postcssPlugin;
      if (pluginNames.indexOf(name) > -1 &&
      // warn for cssnext plugins only
      keys.indexOf(name) > -1 &&
      // show warning once
      spotted.indexOf(name) === -1) {
        messenger.log(_chalk2.default.yellow.bold(msg(name)));
        spotted.push(name);
      } else {
        pluginNames.push(name);
      }
    });

    if (spotted.length > 0 && shouldGlobalWarn) {
      shouldGlobalWarn = false;
      messenger.log(globalWarning);
    }
  };
});

exports.default = warnForDuplicates;