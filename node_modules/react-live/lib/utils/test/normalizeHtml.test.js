'use strict';

var _normalizeHtml = require('../normalizeHtml');

var _normalizeHtml2 = _interopRequireDefault(_normalizeHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('normalizeHtml', function () {
  it('replaces newlines with <br> tags', function () {
    expect((0, _normalizeHtml2.default)('\n')).toBe('<br>');
  });
});