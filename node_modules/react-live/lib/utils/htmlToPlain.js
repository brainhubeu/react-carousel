'use strict';

exports.__esModule = true;

var _unescape = require('unescape');

var _unescape2 = _interopRequireDefault(_unescape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var htmlToPlain = function htmlToPlain(html) {
  return (0, _unescape2.default)(html.replace(/<br>/gm, '\n').replace(/<\/?[^>]*>/gm, ''));
};

exports.default = htmlToPlain;
module.exports = exports['default'];