var assert = require('assert');
var jsan = require('../');

describe('error in toJSON function', function() {
  it('still works', function() {
    var obj = {
      toJSON: function() {
        throw new Error('toJSON is unavailable');
      }
    }
    assert.equal(jsan.stringify(obj, null, null, true), '"toJSON failed for \'$\'"');
    assert.equal(jsan.stringify({ 'obj': obj }, null, null, true), '{"obj":"toJSON failed for \'obj\'"}');
    var o = {};
    o.self = o;
    o.noGood = obj;
    assert.equal(jsan.stringify(o, null, null, true), '{"self":{"$jsan":"$"},"noGood":"toJSON failed for \'noGood\'"}');
  });
});
