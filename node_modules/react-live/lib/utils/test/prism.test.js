'use strict';

var _prism = require('../prism');

var _prism2 = _interopRequireDefault(_prism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var input = 'var x = "Hello World!";';
var expected = '<span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token string">"Hello World!"</span><span class="token punctuation">;</span>';

describe('prism', function () {
  it('should highlight js(x) code', function () {
    expect((0, _prism2.default)(input)).toBe(expected);
  });
});