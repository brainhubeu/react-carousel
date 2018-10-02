var assert = require('assert');
var jsan = require('../');
var immutable = require('immutable');

describe('jsan', function() {


  it('can round trip a regular object', function() {
    var obj1 = {a: {b: {c: {d: 1}}}};
    var obj2 = jsan.parse(jsan.stringify(obj1));
    assert.deepEqual(obj1, obj2);
  });

  it('can round trip a circular object', function() {
    var obj1 = {};
    obj1['self'] = obj1;
    var obj2 = jsan.parse(jsan.stringify(obj1));
    assert.deepEqual(obj2['self'], obj2);
  });

  it('can round trip a self referencing objects', function() {
    var obj1 = {};
    var subObj = {};
    obj1.a = subObj;
    obj1.b = subObj;
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert.deepEqual(obj2.a, obj2.b);
  });

  it('can round trip dates', function() {
    var obj1 = { now: new Date() };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert.deepEqual(obj1, obj2);
  });

  it('can round trip regexs', function() {
    var obj1 = { r: /test/ };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert.deepEqual(obj1, obj2);
  });

  it('can round trip functions (toString())', function() {
    var obj1 = { f: function(foo) { bar } };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert(obj2.f instanceof Function);
    assert.throws(obj2.f);
  });

  it('can round trip undefined', function() {
    var obj1 = { u: undefined };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert('u' in obj2 && obj2.u === undefined);
  });

  it('can round trip errors', function() {
    var obj1 = { e: new Error('oh noh! :O') };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert.deepEqual(obj1.e.message, obj2.e.message);
  });

  it('can round trip a complex object', function() {
    var obj1 = {
      sub1: {},
      now: new Date()
    };
    obj1['self'] = obj1;
    obj1.sub2 = obj1.sub1;
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert(obj2.now instanceof Date);
    assert.deepEqual(obj2.sub1, obj2.sub2);
    assert(obj2['self'] === obj2);
  });

  it('allows a custom function toString()', function() {
    var obj1 = { f: function() { return 42; } };
    var options = {};
    options['function'] = function(fn) { return fn.toString().toUpperCase(); };
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, options));
    assert.deepEqual(obj2.f.toString(), obj1.f.toString().toUpperCase());
  });

  it("doesn't blow up for object with $jsan keys", function() {
    var obj1 = {$jsan: 'd1400000000000'};
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert.deepEqual(obj1, obj2);
  });

  it("doesn't blow up for object with special $jsan keys", function() {
    var obj1 = {$jsan: new Date()};
    var obj2 = jsan.parse(jsan.stringify(obj1, null, null, true));
    assert.deepEqual(obj1, obj2);
  });

  it("doesn't blow up on immutable.js", function() {
    var obj = {
      i: immutable.Map({
        someList: immutable.List(),
        someMap: immutable.Map({
          foo: function() {},
          bar: 123
        })
      })
    };
    assert.deepEqual(JSON.stringify(obj), jsan.stringify(obj));
  });

  it("allows replacer functions when traversing", function() {
    var obj1 = {
      i: immutable.Map({
        someList: immutable.List(),
        someMap: immutable.Map({
          foo: function() {},
          bar: 123
        })
      })
    };
    obj1.self = obj1;
    var obj2 = jsan.parse(jsan.stringify(obj1, function(key, value) {
      if (value && value.toJS) { return value.toJS(); }
      return value;
    }, null, true));
    assert.deepEqual(obj2.i.someList, []);
    assert.deepEqual(obj2.self, obj2);
    assert(obj2.i.someMap.foo instanceof Function);
  });


});
