"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

var _caniuseApi = require("caniuse-api");

var _features = require("./features");

var _features2 = _interopRequireDefault(_features);

var _featuresActivationMap = require("./features-activation-map");

var _featuresActivationMap2 = _interopRequireDefault(_featuresActivationMap);

var _warnForDuplicates = require("./warn-for-duplicates");

var _warnForDuplicates2 = _interopRequireDefault(_warnForDuplicates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = _postcss2.default.plugin("postcss-cssnext", function (options) {
  options = _extends({
    console: console,
    warnForDuplicates: true,
    features: {}
  }, options);

  var features = options.features;

  // propagate browsers option to plugins that supports it
  var pluginsToPropagateBrowserOption = ["autoprefixer", "rem"];
  pluginsToPropagateBrowserOption.forEach(function (name) {
    var feature = features[name];

    if (feature !== false) {
      features[name] = _extends({
        browsers: feature && feature.browsers ? feature.browsers : options.browsers
      }, feature || {});
    }
  });

  // autoprefixer doesn't like an "undefined" value. Related to coffee ?
  if (features.autoprefixer && features.autoprefixer.browsers === undefined) {
    delete features.autoprefixer.browsers;
  }

  var processor = (0, _postcss2.default)();

  // features
  Object.keys(_features2.default).forEach(function (key) {
    // feature is auto enabled if: not disable && (enabled || no data yet ||
    // !supported yet)
    if (
    // feature is not disabled
    features[key] !== false && (
    // feature is enabled
    features[key] === true ||

    // feature don't have any browsers data (yet)
    _featuresActivationMap2.default[key] === undefined ||

    // feature is not yet supported by the browsers scope
    _featuresActivationMap2.default[key] && _featuresActivationMap2.default[key][0] && !(0, _caniuseApi.isSupported)(_featuresActivationMap2.default[key][0], options.browsers))) {
      var _plugin = _features2.default[key](_typeof(features[key]) === "object" ? _extends({}, features[key]) : undefined);
      processor.use(_plugin);
    }
  });

  if (options.warnForDuplicates) {
    processor.use((0, _warnForDuplicates2.default)({
      keys: Object.keys(_features2.default),
      console: options.console
    }));
  }

  return processor;
});

// es5/6 support
plugin.features = _features2.default;

module.exports = plugin;