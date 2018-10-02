var fs = require('fs');
var expect = require('chai').expect;
var RandStream = require('randstream');
var TruncateStream = require('truncate-stream');
var DevNullStream = require('dev-null-stream');
var concat = require('concat-stream');

var peek = require('./buffer-peek-stream');


function make(size, mode) {
  return (new RandStream({mode: mode || 'pseudo'})).pipe(new TruncateStream({maxBytes: size}));
}

describe('peek', function() {
  this.timeout(250);

  it('should callback with a buffer', function (done) {
    var source = make(50000);
    peek(source, 50000, function (err, buffer) {
      if (err) return done(err);
      expect(buffer).to.be.an.instanceof(Buffer);
      done();
    }).pipe(new DevNullStream());
  });

  it('should callback with exactly the number of bytes requested', function (done) {
    peek(make(50000), 1000, function (err, buffer) {
      if (err) return done(err);
      expect(buffer).to.have.lengthOf(1000);
      done();
    });
  });

  it('should callback with all bytes when peeking more than is available', function (done) {
    peek(make(1000), 5000, function (err, buffer) {
      if (err) return done(err);
      expect(buffer).to.have.lengthOf(1000);
      done();
    });
  });

  it('should callback with a stream which receives all bytes', function (done) {
    var source = make(50000);
    peek(source, 1000, function (err, buffer, stream) {
      if (err) return done(err);
      stream.pipe(concat(function (data) {
        expect(data).to.have.lengthOf(50000);
        done();
      }));
    });
  });

  it('should return a stream which receives all bytes', function (done) {
    peek(make(5000), 1000, function () {}).pipe(concat(function (data) {
      expect(data).to.have.lengthOf(5000);
      done();
    }));
  });

  it('should return the same stream as it calls back', function (done) {
    var res = peek(make(5000), 1000, function (err, buffer, stream) {
      if (err) return done(err);
      expect(stream).to.equal(res);
      done();
    });
  });

  it('should peek 65536 bytes by default', function (done) {
    peek(make(100000), function (err, buffer) {
      if (err) return done(err);
      expect(buffer).to.have.lengthOf(65536);
      done();
    });
  });

  it('should work when peeked more once in a pipeline', function (done) {
    peek(make(100000), 50000, function (err, first, stream) {
      if (err) return done(err);
      expect(first).to.have.lengthOf(50000);
      peek(stream, 40000, function (err, second, stream) {
        if (err) return done(err);
        expect(second).to.have.lengthOf(40000);
        expect(second).to.eql(first.slice(0, 40000));
        stream.pipe(concat(function (data) {
          expect(data).to.have.lengthOf(100000);
          expect(first).to.eql(data.slice(0, 50000));
          expect(second).to.eql(data.slice(0, 40000));
          done();
        }));
      });
    });
  });

  //TODO: peeking inside gzip data (transform)

  //TODO: peeking a http response
});