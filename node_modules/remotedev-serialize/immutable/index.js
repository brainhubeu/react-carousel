var jsan = require('jsan');
var serialize = require('./serialize');

module.exports = function(Immutable, refs) {
  return {
    stringify: function(data) {
      return jsan.stringify(data, serialize(Immutable, refs).replacer, null, true);
    },
    parse: function(data) {
      return jsan.parse(data, serialize(Immutable, refs).reviver);
    },
    serialize: serialize
  }
};
