'use strict';

exports.__esModule = true;
var normalizeHtml = function normalizeHtml(html) {
  return html.replace('\n', '<br>');
};

exports.default = normalizeHtml;
module.exports = exports['default'];