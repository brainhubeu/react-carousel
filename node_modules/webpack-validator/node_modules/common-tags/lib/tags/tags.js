'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = tags;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tags(opts) {
  var settings = (0, _extends3.default)({
    trim: true,
    oneLine: false,
    stripIndent: false,
    includeArrays: false
  }, opts);
  // return a tag function that transforms our template
  return function tag(template) {
    for (var _len = arguments.length, expressions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expressions[_key - 1] = arguments[_key];
    }

    // join the parts necessary to re-construct the template
    var temp = template.reduce(function (accumulator, part, i) {
      var expression = expressions[i - 1];
      if (settings.includeArrays && Array.isArray(expression)) {
        var sep = settings.includeArrays.separator || '';
        var con = settings.includeArrays.conjunction;
        // inline arrays, making sure to include item separator
        expression = expression.join(sep + accumulator.match(/(\s+)$/)[1]);
        if (con) {
          // replace the last separator with the conjunction
          var sepIndex = expression.lastIndexOf(sep);
          expression = expression.substr(0, sepIndex) + ' ' + con + expression.substr(sepIndex + 1);
        }
      }
      return accumulator + expression + part;
    });
    // replace any newlines with spaces if we just want
    // a one liner
    if (settings.oneLine) {
      temp = temp.replace(/(?:\s+)/g, ' ');
    }
    if (settings.oneLineTrim) {
      temp = temp.replace(/(?:\n\s+)/g, '');
    }
    if (settings.stripIndent) {
      // strip leading indents
      var match = temp.match(/^[ \t]*(?=\S)/gm);
      var indent = Math.min.apply(Math, (0, _toConsumableArray3.default)(match.map(function (el) {
        return el.length;
      })));
      var regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');
      temp = indent > 0 ? temp.replace(regexp, '') : temp;
    }
    // trim leading and trailing whitespace
    if (settings.trim) {
      temp = temp.trim();
    }
    return temp;
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90YWdzL3RhZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O2tCQUV3QixJOzs7O0FBQVQsU0FBUyxJQUFULENBQWUsSUFBZixFQUFxQjtBQUNsQyxNQUFNO0FBQ0osVUFBTSxJQURGO0FBRUosYUFBUyxLQUZMO0FBR0osaUJBQWEsS0FIVDtBQUlKLG1CQUFlO0FBSlgsS0FLRCxJQUxDLENBQU47O0FBUUEsU0FBTyxTQUFTLEdBQVQsQ0FBYyxRQUFkLEVBQXdDO0FBQUEsc0NBQWIsV0FBYTtBQUFiLGlCQUFhO0FBQUE7OztBQUU3QyxRQUFJLE9BQU8sU0FBUyxNQUFULENBQWdCLFVBQUMsV0FBRCxFQUFjLElBQWQsRUFBb0IsQ0FBcEIsRUFBMEI7QUFDbkQsVUFBSSxhQUFhLFlBQVksSUFBSSxDQUFoQixDQUFqQjtBQUNBLFVBQUksU0FBUyxhQUFULElBQTBCLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBOUIsRUFBeUQ7QUFDdkQsWUFBTSxNQUFNLFNBQVMsYUFBVCxDQUF1QixTQUF2QixJQUFvQyxFQUFoRDtBQUNBLFlBQU0sTUFBTSxTQUFTLGFBQVQsQ0FBdUIsV0FBbkM7O0FBRUEscUJBQWEsV0FBVyxJQUFYLENBQWdCLE1BQU0sWUFBWSxLQUFaLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLENBQXRCLENBQWI7QUFDQSxZQUFJLEdBQUosRUFBUzs7QUFFUCxjQUFNLFdBQVcsV0FBVyxXQUFYLENBQXVCLEdBQXZCLENBQWpCO0FBQ0EsdUJBQWEsV0FBVyxNQUFYLENBQWtCLENBQWxCLEVBQXFCLFFBQXJCLElBQWlDLEdBQWpDLEdBQXVDLEdBQXZDLEdBQTZDLFdBQVcsTUFBWCxDQUFrQixXQUFXLENBQTdCLENBQTFEO0FBQ0Q7QUFDRjtBQUNELGFBQU8sY0FBYyxVQUFkLEdBQTJCLElBQWxDO0FBQ0QsS0FkVSxDQUFYOzs7QUFpQkEsUUFBSSxTQUFTLE9BQWIsRUFBc0I7QUFDcEIsYUFBTyxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEdBQXpCLENBQVA7QUFDRDtBQUNELFFBQUksU0FBUyxXQUFiLEVBQTBCO0FBQ3hCLGFBQU8sS0FBSyxPQUFMLENBQWEsWUFBYixFQUEyQixFQUEzQixDQUFQO0FBQ0Q7QUFDRCxRQUFJLFNBQVMsV0FBYixFQUEwQjs7QUFFeEIsVUFBTSxRQUFRLEtBQUssS0FBTCxDQUFXLGlCQUFYLENBQWQ7QUFDQSxVQUFNLFNBQVMsS0FBSyxHQUFMLDhDQUFZLE1BQU0sR0FBTixDQUFVO0FBQUEsZUFBTSxHQUFHLE1BQVQ7QUFBQSxPQUFWLENBQVosRUFBZjtBQUNBLFVBQU0sU0FBUyxJQUFJLE1BQUosQ0FBVyxhQUFhLE1BQWIsR0FBc0IsR0FBakMsRUFBc0MsSUFBdEMsQ0FBZjtBQUNBLGFBQU8sU0FBUyxDQUFULEdBQWEsS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixFQUFyQixDQUFiLEdBQXdDLElBQS9DO0FBQ0Q7O0FBRUQsUUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsYUFBTyxLQUFLLElBQUwsRUFBUDtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0FyQ0Q7QUFzQ0QiLCJmaWxlIjoidGFncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0YWdzIChvcHRzKSB7XG4gIGNvbnN0IHNldHRpbmdzID0ge1xuICAgIHRyaW06IHRydWUsXG4gICAgb25lTGluZTogZmFsc2UsXG4gICAgc3RyaXBJbmRlbnQ6IGZhbHNlLFxuICAgIGluY2x1ZGVBcnJheXM6IGZhbHNlLFxuICAgIC4uLm9wdHNcbiAgfVxuICAvLyByZXR1cm4gYSB0YWcgZnVuY3Rpb24gdGhhdCB0cmFuc2Zvcm1zIG91ciB0ZW1wbGF0ZVxuICByZXR1cm4gZnVuY3Rpb24gdGFnICh0ZW1wbGF0ZSwgLi4uZXhwcmVzc2lvbnMpIHtcbiAgICAvLyBqb2luIHRoZSBwYXJ0cyBuZWNlc3NhcnkgdG8gcmUtY29uc3RydWN0IHRoZSB0ZW1wbGF0ZVxuICAgIGxldCB0ZW1wID0gdGVtcGxhdGUucmVkdWNlKChhY2N1bXVsYXRvciwgcGFydCwgaSkgPT4ge1xuICAgICAgbGV0IGV4cHJlc3Npb24gPSBleHByZXNzaW9uc1tpIC0gMV1cbiAgICAgIGlmIChzZXR0aW5ncy5pbmNsdWRlQXJyYXlzICYmIEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgY29uc3Qgc2VwID0gc2V0dGluZ3MuaW5jbHVkZUFycmF5cy5zZXBhcmF0b3IgfHwgJydcbiAgICAgICAgY29uc3QgY29uID0gc2V0dGluZ3MuaW5jbHVkZUFycmF5cy5jb25qdW5jdGlvblxuICAgICAgICAvLyBpbmxpbmUgYXJyYXlzLCBtYWtpbmcgc3VyZSB0byBpbmNsdWRlIGl0ZW0gc2VwYXJhdG9yXG4gICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLmpvaW4oc2VwICsgYWNjdW11bGF0b3IubWF0Y2goLyhcXHMrKSQvKVsxXSlcbiAgICAgICAgaWYgKGNvbikge1xuICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGxhc3Qgc2VwYXJhdG9yIHdpdGggdGhlIGNvbmp1bmN0aW9uXG4gICAgICAgICAgY29uc3Qgc2VwSW5kZXggPSBleHByZXNzaW9uLmxhc3RJbmRleE9mKHNlcClcbiAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5zdWJzdHIoMCwgc2VwSW5kZXgpICsgJyAnICsgY29uICsgZXhwcmVzc2lvbi5zdWJzdHIoc2VwSW5kZXggKyAxKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBleHByZXNzaW9uICsgcGFydFxuICAgIH0pXG4gICAgLy8gcmVwbGFjZSBhbnkgbmV3bGluZXMgd2l0aCBzcGFjZXMgaWYgd2UganVzdCB3YW50XG4gICAgLy8gYSBvbmUgbGluZXJcbiAgICBpZiAoc2V0dGluZ3Mub25lTGluZSkge1xuICAgICAgdGVtcCA9IHRlbXAucmVwbGFjZSgvKD86XFxzKykvZywgJyAnKVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3Mub25lTGluZVRyaW0pIHtcbiAgICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoLyg/OlxcblxccyspL2csICcnKVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3Muc3RyaXBJbmRlbnQpIHtcbiAgICAgIC8vIHN0cmlwIGxlYWRpbmcgaW5kZW50c1xuICAgICAgY29uc3QgbWF0Y2ggPSB0ZW1wLm1hdGNoKC9eWyBcXHRdKig/PVxcUykvZ20pXG4gICAgICBjb25zdCBpbmRlbnQgPSBNYXRoLm1pbiguLi5tYXRjaC5tYXAoZWwgPT4gZWwubGVuZ3RoKSlcbiAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ15bIFxcXFx0XXsnICsgaW5kZW50ICsgJ30nLCAnZ20nKVxuICAgICAgdGVtcCA9IGluZGVudCA+IDAgPyB0ZW1wLnJlcGxhY2UocmVnZXhwLCAnJykgOiB0ZW1wXG4gICAgfVxuICAgIC8vIHRyaW0gbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICAgIGlmIChzZXR0aW5ncy50cmltKSB7XG4gICAgICB0ZW1wID0gdGVtcC50cmltKClcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBcbiAgfVxufVxuIl19