'use strict';

var _htmlToPlain = require('../htmlToPlain');

var _htmlToPlain2 = _interopRequireDefault(_htmlToPlain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = '&lt;div&gt;abc&lt;/div&gt;<br><span>';

describe('htmlToPlain', function () {
  it('converts escaped html to a plain string', function () {
    expect((0, _htmlToPlain2.default)(html)).toBe('<div>abc</div>\n');
  });
});