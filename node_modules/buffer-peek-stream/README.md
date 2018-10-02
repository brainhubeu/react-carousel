# node-buffer-peek-stream

[![Build Status](https://travis-ci.org/seangarner/node-buffer-peek-stream.svg?branch=master)](https://travis-ci.org/seangarner/node-buffer-peek-stream)

A Transform stream which lets you take a peek at the first bytes before unpiping itself and
unshifting the buffer back onto the upstream stream leaving the original stream ready to be
piped again onto its final destination.

```
npm install buffer-peek-stream
```

Useful if you want to inspect the start of a stream before deciding what to do with it.

This works with buffers and does no string decoding.  If you know you have a string and already
know its encoding then checkout [peek-stream](https://github.com/mafintosh/peek-stream).


## Usage
As a function...
```
var peek = require('buffer-peek-stream');
var readstream = fs.createReadStream('package.json');

peek(readstream, 65536, function (err, data, outputStream) {
  if (err) throw err;

  // outputStream is ready to be piped somewhere else
  outputStream.pipe(somewhere_else);
});
```

As a stream...
```
var PeekStream = require('buffer-peek-stream').BufferPeekStream;

var peek = new PeekStream(65536);
var readstream = fs.createReadStream('package.json');

// peek will only emit the data event once
peek.once('data', function (buf) {

  // readstream is ready to be piped somewhere else
  peek.pipe(somewhere_else);
});

readstream.pipe(peek);

// alternatively pipe `peek` here instead of in `data` callback
```


## Licence
MIT
