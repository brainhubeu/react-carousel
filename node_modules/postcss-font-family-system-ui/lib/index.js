'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fontFamilySystemUIList = ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'];

var parsedFontFamilySystemUIListTree = (0, _postcssValueParser2.default)(fontFamilySystemUIList.join(', '));

var transformFontFamilySystemUI = function transformFontFamilySystemUI(nodes) {
  return (0, _lodash.flatMap)(nodes, function (node) {
    if (node.type === 'word' && node.value === 'system-ui') {
      return parsedFontFamilySystemUIListTree;
    }
    return node;
  });
};

var transform = function transform() {
  return function (decl) {
    var tree = void 0;
    if (decl.type === 'decl') {
      if (decl.prop === 'font-family' || decl.prop === 'font') {
        tree = (0, _postcssValueParser2.default)(decl.value);
        tree.nodes = transformFontFamilySystemUI(tree.nodes);
        decl.value = tree.toString();
      }
    }
  };
};

exports.default = _postcss2.default.plugin('postcss-font-family-system-ui', function () {
  return function (root) {
    root.walk(transform());
  };
});
module.exports = exports['default'];