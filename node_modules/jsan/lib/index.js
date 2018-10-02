var cycle = require('./cycle');

exports.stringify = function stringify(value, replacer, space, _options) {
  var options = _options || false;
  if (typeof options === 'boolean') {
    options = {
      'date': options,
      'function': options,
      'regex': options,
      'undefined': options,
      'error': options,
      'symbol': options,
      'map': options,
      'set': options,
      'nan': options,
      'infinity': options
    }
  }

  var decycled = cycle.decycle(value, options, replacer);
  return JSON.stringify(decycled);
}

exports.parse = function parse(text, reviver) {
  var needsRetrocycle = /"\$jsan"/.test(text);
  var replaced = JSON.parse(text);
  var resolved = cycle.retrocycle(replaced);
  if(reviver) {
    var temp = JSON.stringify(resolved);
    var parsed = JSON.parse(temp, reviver);
    return parsed;
  }
  return resolved;
}
