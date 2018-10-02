var assert = require('assert');
var jsan = require('../');

describe('newline before function curly brace', function() {
  it('still works', function() {
    var fn = function foo(a,b, c)
    {
      return 123;
    };
    assert.equal(jsan.stringify(fn, null, null, true), '{"$jsan":"ffunction foo(a,b, c) { /* ... */ }"}');
  });
});
