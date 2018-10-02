'use strict';

var _cn = require('../cn');

var _cn2 = _interopRequireDefault(_cn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('cn', function () {
  it('joins classnames', function () {
    expect((0, _cn2.default)()).toBe('');
    expect((0, _cn2.default)('a')).toBe('a');
    expect((0, _cn2.default)('a', 'b')).toBe('a b');
  });
});