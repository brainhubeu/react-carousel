var formatter = require('../index.js');
var assert = require('assert');

describe('sc-formatter', function () {

  var ab2str = function (buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  };

  var str2ab = function (str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  describe('sc-formatter#encode', function () {
    it('should encode an Object into a string', function (done) {
      var rawObject = {
        foo: 123,
        arr: [1, 2, 3, 4],
        complexArr: [
          {a: 1, b: 2},
          {c: 3, d: 4, e: 5},
          {foo: 'bar'},
          ['a', 'b', 'c', {nested: 'object'}]
        ],
        ob: {hi: 'hello'}
      };
      rawObject.complexArr.push(rawObject.arr);

      var encoded = formatter.encode(rawObject);
      var expected = JSON.stringify(rawObject);
      assert(encoded == expected, 'Encoded data did not match expected output');
      done();
    });

    it('should serialize binary Buffer objects to base64 strings', function (done) {
      var rawObject = {
        foo: 123,
        buff: new Buffer('hello', 'utf8'),
        buffArr: [new Buffer('world', 'utf8')]
      };
      var encoded = formatter.encode(rawObject);
      var expected = JSON.stringify({
        foo: 123,
        buff: {base64: true, data: 'aGVsbG8='},
        buffArr: [
          {base64: true, data: 'd29ybGQ='}
        ]
      });
      assert(encoded == expected, 'Encoded data did not match expected output');
      done();
    });

    it('should serialize binary ArrayBuffer objects to base64 strings', function (done) {
      var rawObject = {
        foo: 123,
        buff: str2ab('hello'),
        buffArr: [str2ab('world')]
      };
      var encoded = formatter.encode(rawObject);
      var expected = JSON.stringify({
        foo: 123,
        buff: {base64: true, data: 'aGVsbG8='},
        buffArr: [
          {base64: true, data: 'd29ybGQ='}
        ]
      });
      assert(encoded == expected, 'Encoded data did not match expected output');
      done();
    });

    it('should throw error if there is a circular structure - Basic', function (done) {
      var rawObject = {
        foo: 123,
        arr: []
      };
      rawObject.arr.push(rawObject);

      var error;
      try {
        var encoded = formatter.encode(rawObject);
      } catch (err) {
        error = err;
      }
      assert(error != null, 'Expected an error to be thrown');
      done();
    });

    it('should throw error if there is a circular structure - Single level nesting', function (done) {
      var rawObject = {
        foo: {hello: 'world'}
      };
      rawObject.foo.bar = rawObject.foo;

      var error;
      try {
        var encoded = formatter.encode(rawObject);
      } catch (err) {
        error = err;
      }
      assert(error != null, 'Expected an error to be thrown');
      done();
    });

    it('should throw error if there is a circular structure - Deep nesting', function (done) {
      var rawObject = {
        foo: {
          hello: 'world',
          bar: {
            deep: {}
          }
        }
      };
      rawObject.foo.bar.deep = rawObject.foo;

      var error;
      try {
        var encoded = formatter.encode(rawObject);
      } catch (err) {
        error = err;
      }
      assert(error != null, 'Expected an error to be thrown');
      done();
    });

    it('should ignore prototype properties', function (done) {
      Object.prototype.prototypeProperty = 456;
      var rawObject = {
        foo: 123
      };
      var encoded = formatter.encode(rawObject);
      var expected = '{"foo":123}';
      assert(encoded == expected, 'Encoded data did not match expected output');
      delete Object.prototype.prototypeProperty;
      done();
    });

    it('should ignore properties which contain functions', function (done) {
      var rawObject = {
        foo: 123,
        fun: function () {
          return 456;
        }
      };
      var encoded = formatter.encode(rawObject);
      var expected = JSON.stringify({foo: 123});
      assert(encoded == expected, 'Encoded data did not match expected output');
      done();
    });
  });
});
