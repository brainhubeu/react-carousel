var assert = require('assert');
var jsan = require('../');

describe('jsan', function() {
    describe('has a stringify method', function() {
    it('behaves the same as JSON.stringify for simple jsonable objects', function() {
      var obj = {
        a: 1,
        b: 'string',
        c: [2,3],
        d: null
      };
      assert.equal(JSON.stringify(obj), jsan.stringify(obj));
    });

    it('uses the toJSON() method when possible', function() {
      var obj = { a: { b: 1, toJSON: function(key) { return key } } };
      assert.equal(jsan.stringify(obj, null, null, false), '{"a":"a"}');
    });

    it('can handle dates', function() {
      var obj = {
        now: new Date()
      }
      var str = jsan.stringify(obj, null, null, true);
      assert(/^\{"now":\{"\$jsan":"d[^"]*"\}\}$/.test(str));
    });

    it('can handle regexes', function() {
      var obj = {
        r: /test/
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"r":{"$jsan":"r,test"}}');
    });

    it('can handle functions', function() {
      var obj = {
        f: function () {}
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"f":{"$jsan":"ffunction () { /* ... */ }"}}');
    });

    it('can handle undefined', function() {
      var obj = undefined;
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"$jsan":"u"}');
    });

    it('can handle NaN', function() {
      var obj = NaN;
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"$jsan":"n"}');
    });

    it('can handle Infinity', function() {
      var obj = Infinity;
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"$jsan":"i"}');
    });

    it('can handle -Infinity', function() {
      var obj = -Infinity;
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"$jsan":"y"}');
    });

    it('can handle nested undefined', function() {
      var obj = {
        u: undefined
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"u":{"$jsan":"u"}}');
    });

    it('can handle nested NaN', function() {
      var obj = {
        u: NaN
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"u":{"$jsan":"n"}}');
    });

    it('can handle nested Infinity', function() {
      var obj = {
        u: Infinity
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"u":{"$jsan":"i"}}');
    });

    it('can handle nested -Infinity', function() {
      var obj = {
        u: -Infinity
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"u":{"$jsan":"y"}}');
    });

    it('can handle errors', function() {
      var obj = {
        e: new Error(':(')
      }
      var str = jsan.stringify(obj, null, null, true);
      assert.deepEqual(str, '{"e":{"$jsan":"e:("}}');
    });

    if (typeof Symbol !== 'undefined') {
      it('can handle ES symbols', function() {
        var obj = {
          s: Symbol('a')
        }
        var str = jsan.stringify(obj, null, null, true);
        assert.deepEqual(str, '{"s":{"$jsan":"sa"}}');
      });

      it('can handle global ES symbols', function() {
        var obj = {
          g: Symbol.for('a')
        }
        var str = jsan.stringify(obj, null, null, true);
        assert.deepEqual(str, '{"g":{"$jsan":"ga"}}');
      });
    }

    if (typeof Map !== 'undefined' && typeof Array.from !== 'undefined') {
      it('can handle ES Map', function() {
        var obj = {
          map: new Map([
            ['a', 1],
            [{toString: function (){ return 'a' }}, 2],
            [{}, 3]
          ])
        }
        var str = jsan.stringify(obj, null, null, true);
        assert.deepEqual(str, '{"map":{"$jsan":"m[[\\"a\\",1],[{\\"toString\\":{\\"$jsan\\":\\"ffunction (){ /* ... */ }\\"}},2],[{},3]]"}}');
      });
    }

    if (typeof Set !== 'undefined' && typeof Array.from !== 'undefined') {
      it('can handle ES Set', function() {
        var obj = {
          set: new Set(['a', {toString: function (){ return 'a' }}, {}])
        }
        var str = jsan.stringify(obj, null, null, true);
        assert.deepEqual(str, '{"set":{"$jsan":"l[\\"a\\",{\\"toString\\":{\\"$jsan\\":\\"ffunction (){ /* ... */ }\\"}},{}]"}}');
      });
    }

    it('works on objects with circular references', function() {
      var obj = {};
      obj['self'] = obj;
      assert.equal(jsan.stringify(obj), '{"self":{"$jsan":"$"}}');
    });

    it('can use the circular option', function() {
      var obj = {};
      obj.self = obj;
      obj.a = 1;
      obj.b = {};
      obj.c = obj.b;
      assert.equal(jsan.stringify(obj, null, null, {circular: '∞'}), '{"self":"∞","a":1,"b":{},"c":{"$jsan":"$.b"}}');
      assert.equal(jsan.stringify(obj, null, null, {circular: function() { return '∞!' }}), '{"self":"∞!","a":1,"b":{},"c":{"$jsan":"$.b"}}');
    });

    it('works on objects with "[", "\'", and "]" in the keys', function() {
      var obj = {};
      obj['["key"]'] = {};
      obj['["key"]']['["key"]'] = obj['["key"]'];
      assert.equal(jsan.stringify(obj), '{"[\\"key\\"]":{"[\\"key\\"]":{"$jsan":"$[\\"[\\\\\\"key\\\\\\"]\\"]"}}}');
    });

    it('works on objects that will get encoded with \\uXXXX', function() {
      var obj = {"\u017d\u010d":{},"kraj":"\u017du\u017e"};
      obj["\u017d\u010d"]["\u017d\u010d"] = obj["\u017d\u010d"];
      assert.equal(jsan.stringify(obj), '{"\u017d\u010d":{"\u017d\u010d":{"$jsan":"$[\\\"\u017d\u010d\\\"]"}},"kraj":"Žuž"}');
    });

    it('works on circular arrays', function() {
      var obj = [];
      obj[0] = [];
      obj[0][0] = obj[0];
      assert.equal(jsan.stringify(obj), '[[{"$jsan":"$[0]"}]]');
    });

    it('works correctly for mutiple calls with the same object', function() {
      var obj = {};
      obj.self = obj;
      obj.a = {};
      obj.b = obj.a;
      assert.equal(jsan.stringify(obj), '{"self":{"$jsan":"$"},"a":{},"b":{"$jsan":"$.a"}}');
      assert.equal(jsan.stringify(obj), '{"self":{"$jsan":"$"},"a":{},"b":{"$jsan":"$.a"}}');
    });

  });



  describe('has a parse method', function() {
    it('behaves the same as JSON.parse for valid json strings', function() {
      var str = '{"a":1,"b":"string","c":[2,3],"d":null}';
      assert.deepEqual(JSON.parse(str), jsan.parse(str));
    });

    it('can decode dates', function() {
      var str = '{"$jsan":"d1400000000000"}';
      var obj = jsan.parse(str);
      assert(obj instanceof Date);
    });

    it('can decode regexes', function() {
      str = '{"$jsan":"r,test"}';
      var obj = jsan.parse(str);
      assert(obj instanceof RegExp )
    });

    it('can decode functions', function() {
      str = '{"$jsan":"ffunction () { /* ... */ }"}';
      var obj = jsan.parse(str);
      assert(obj instanceof Function);
    });

    it('can decode undefined', function() {
      str = '{"$jsan":"u"}';
      var obj = jsan.parse(str);
      assert(obj === undefined);
    });

    it('can decode NaN', function() {
      str = '{"$jsan":"n"}';
      var obj = jsan.parse(str);
      assert(isNaN(obj) && typeof obj === 'number');
    });

    it('can decode Infinity', function() {
      str = '{"$jsan":"i"}';
      var obj = jsan.parse(str);
      assert(obj === Number.POSITIVE_INFINITY);
    });

    it('can decode -Infinity', function() {
      str = '{"$jsan":"y"}';
      var obj = jsan.parse(str);
      assert(obj === Number.NEGATIVE_INFINITY);
    });

    it('can decode errors', function() {
      str = '{"$jsan":"e:("}';
      var obj = jsan.parse(str);
      assert(obj instanceof Error && obj.message === ':(');
    });

    it('can decode nested dates', function() {
      var str = '{"now":{"$jsan":"d1400000000000"}}';
      var obj = jsan.parse(str);
      assert(obj.now instanceof Date);
    });

    it('can decode nested regexes', function() {
      str = '{"r":{"$jsan":"r,test"}}';
      var obj = jsan.parse(str);
      assert(obj.r instanceof RegExp )
    });

    it('can decode nested functions', function() {
      str = '{"f":{"$jsan":"ffunction () { /* ... */ }"}}';
      var obj = jsan.parse(str);
      assert(obj.f instanceof Function);
    });

    it('can decode nested undefined', function() {
      str = '{"u":{"$jsan":"u"}}';
      var obj = jsan.parse(str);
      assert('u' in obj && obj.u === undefined);
    });

    it('can decode nested NaN', function() {
      str = '{"u":{"$jsan":"n"}}';
      var obj = jsan.parse(str);
      assert('u' in obj && isNaN(obj.u) && typeof obj.u === 'number');
    });

    it('can decode nested Infinity', function() {
      str = '{"u":{"$jsan":"i"}}';
      var obj = jsan.parse(str);
      assert('u' in obj && obj.u === Number.POSITIVE_INFINITY);
    });

    it('can decode nested -Infinity', function() {
      str = '{"u":{"$jsan":"y"}}';
      var obj = jsan.parse(str);
      assert('u' in obj && obj.u === Number.NEGATIVE_INFINITY);
    });

    it('can decode nested errors', function() {
      str = '{"e":{"$jsan":"e:("}}';
      var obj = jsan.parse(str);
      assert(obj.e instanceof Error && obj.e.message === ':(');
    });

    if (typeof Symbol !== 'undefined') {
      it('can decode ES symbols', function() {
        str = '{"s1":{"$jsan":"sfoo"}, "s2":{"$jsan":"s"}}';
        var obj = jsan.parse(str);
        assert(typeof obj.s1 === 'symbol' && obj.s1.toString() === 'Symbol(foo)');
        assert(typeof obj.s2 === 'symbol' && obj.s2.toString() === 'Symbol()');
      });

      it('can decode global ES symbols', function() {
        str = '{"g1":{"$jsan":"gfoo"}, "g2":{"$jsan":"gundefined"}}';
        var obj = jsan.parse(str);
        assert(typeof obj.g1 === 'symbol' && obj.g1 === Symbol.for('foo'));
        assert(typeof obj.g2 === 'symbol' && obj.g2 === Symbol.for());
      });
    }

    if (typeof Map !== 'undefined' && typeof Array.from !== 'undefined') {
      it('can decode ES Map', function() {
        var str = '{"map":{"$jsan":"m[[\\"a\\",1],[{\\"toString\\":{\\"$jsan\\":\\"ffunction (){ /* ... */ }\\"}},2],[{},3]]"}}';
        var obj = jsan.parse(str);
        var keys = obj.map.keys();
        var values = obj.map.values();
        assert.equal(keys.next().value, 'a');
        assert.equal(typeof keys.next().value.toString, 'function');
        assert.equal(typeof keys.next().value, 'object');
        assert.equal(values.next().value, 1);
        assert.equal(values.next().value, 2);
        assert.equal(values.next().value, 3);
      });
    }

    if (typeof Set !== 'undefined' && typeof Array.from !== 'undefined') {
      it('can decode ES Set', function() {
        var str = '{"set":{"$jsan":"l[\\"a\\",{\\"toString\\":{\\"$jsan\\":\\"ffunction (){ /* ... */ }\\"}},{}]"}}';
        var obj = jsan.parse(str);
        var values = obj.set.values();
        assert.equal(values.next().value, 'a');
        assert.equal(typeof values.next().value.toString, 'function');
        assert.equal(typeof values.next().value, 'object');
      });
    }

    it('works on object strings with a circular dereferences', function() {
      var str = '{"a":1,"b":"string","c":[2,3],"d":null,"self":{"$jsan":"$"}}';
      var obj = jsan.parse(str);
      assert.deepEqual(obj['self'], obj);
    });

    it('works on object strings with "[", "\'", and "]" in the keys', function() {
      var str = '{"[\\"key\\"]":{"[\\"key\\"]":{"$jsan":"$[\\"[\\\\\\"key\\\\\\"]\\"]"}}}';
      var obj = jsan.parse(str);
      assert.deepEqual(obj['["key"]']['["key"]'], obj['["key"]']);
    });

    it('works on objects encoded with \\uXXXX', function() {
      var str = '{"\u017d\u010d":{"\u017d\u010d":{"$jsan":"$[\\\"\\u017d\\u010d\\\"]"}},"kraj":"Žuž"}';
      var obj = jsan.parse(str);
      assert.deepEqual(obj["\u017d\u010d"]["\u017d\u010d"], obj["\u017d\u010d"]);
    });

    it('works on array strings with circular dereferences', function() {
      var str = '[[{"$jsan":"$[0]"}]]';
      var arr = jsan.parse(str);
      assert.deepEqual(arr[0][0], arr[0]);
    });
  });

});
