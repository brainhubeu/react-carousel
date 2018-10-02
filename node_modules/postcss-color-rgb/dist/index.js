'use strict';

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var _rgbFunctionalNotation = require('./lib/rgb-functional-notation');

var _rgbFunctionalNotation2 = _interopRequireDefault(_rgbFunctionalNotation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformRgb(value) {
    return (0, _postcssValueParser2.default)(value).walk(function (node) {
        /* istanbul ignore if */
        if (node.type !== 'function' || node.value !== 'rgb' && node.value !== 'rgba') {
            return;
        }
        node.value = _rgbFunctionalNotation2.default.legacy(_postcssValueParser2.default.stringify(node));
        node.type = 'word';
    }).toString();
}

module.exports = _postcss2.default.plugin('postcss-color-rgb', function (opts) {
    opts = opts || {};

    return function (root, result) {
        root.walkDecls(function (decl) {
            /* istanbul ignore if */
            if (!decl.value || decl.value.indexOf('rgb(') === -1 && decl.value.indexOf('rgba(') === -1) {
                return;
            }
            decl.value = transformRgb(decl.value);
        });
    };
});