'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _unitsCss = require('units-css');

var _unitsCss2 = _interopRequireDefault(_unitsCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function legacyAlpha(alpha) {
    if (alpha.indexOf('%') > -1) {
        alpha = '' + alpha.slice(0, -1) / 100;
    }
    return alpha.replace(/^0\./, '.');
}

function legacyHue(hue) {
    if (/.*(?:deg|grad|rad|turn)/.test(hue)) {
        return Math.round(_unitsCss2.default.convert('deg', hue) * 1000) / 1000;
    }
    return hue;
}

function getColorData(colorFn) {
    var hslSyntaxPlusAltRegex = /(hsl)a?\s*\(\s*(\d*\.?\d+(?:deg|grad|rad|turn)?)(?:\s+|(?:\s*,\s*))(\d*\.?\d+\%)(?:\s+|(?:\s*,\s*))(\d*\.?\d+\%)(?:\s*(?:\/|,)\s*(\d*\.?\d+\%?))?\s*\)/g; // eslint-disable-line max-len
    var match = hslSyntaxPlusAltRegex.exec(colorFn);
    if (match === null) return false;
    return {
        fn: match[1],
        h: legacyHue(match[2]),
        s: match[3],
        l: match[4],
        alpha: match[5] ? legacyAlpha(match[5]) : false
    };
}

function legacy(colorFn) {
    var colorData = getColorData(colorFn);

    if (!colorData) return colorFn;

    var result = null;
    if (colorData.alpha === false) {
        result = colorData.fn + '(' + colorData.h + ', ' + colorData.s + ', ' + colorData.l + ')';
    } else {
        result = colorData.fn + 'a(' + colorData.h + ', ' + colorData.s + ', ' + colorData.l + ', ' + colorData.alpha + ')';
    }
    return result;
}

exports.default = { legacy: legacy };
module.exports = exports['default'];