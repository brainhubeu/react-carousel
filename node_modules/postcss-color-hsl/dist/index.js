'use strict';

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var _hslFunctionalNotation = require('./lib/hsl-functional-notation');

var _hslFunctionalNotation2 = _interopRequireDefault(_hslFunctionalNotation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformHsl(value) {
    return (0, _postcssValueParser2.default)(value).walk(function (node) {
        /* istanbul ignore if */
        if (node.type !== 'function' || node.value !== 'hsl' && node.value !== 'hsla') {
            return;
        }
        node.value = _hslFunctionalNotation2.default.legacy(_postcssValueParser2.default.stringify(node));
        node.type = 'word';
    }).toString();
}

module.exports = _postcss2.default.plugin('postcss-color-hsl', function (opts) {
    opts = opts || {};

    return function (root, result) {
        root.walkDecls(function (decl) {
            /* istanbul ignore if */
            if (!decl.value || decl.value.indexOf('hsl(') === -1 && decl.value.indexOf('hsla(') === -1) {
                return;
            }
            decl.value = transformHsl(decl.value);
        });
    };
});