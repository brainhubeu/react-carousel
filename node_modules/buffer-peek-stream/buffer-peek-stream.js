var stream = require('stream');
var util = require('util');

function peek(source, bytes, callback) {
  if (!callback) return peek(source, undefined, bytes);

  var dest = new BufferPeekStream({peekBytes: bytes});

  dest.once('peek', function (buffer) {
    callback(null, buffer, dest);
  });

  return source.pipe(dest);
}
peek.BufferPeekStream = BufferPeekStream;

module.exports = peek;


function BufferPeekStream(opts) {
  if (!opts) opts = {};

  opts.highWaterMark = opts.peekBytes || 65536;

  stream.Transform.call(this, opts);

  this._peekState = {
    buffer: [],
    bytes: 0,
    maxBytes: opts.peekBytes || 65536,
    peeked: false
  };
}

util.inherits(BufferPeekStream, stream.Transform);


BufferPeekStream.prototype._transform = function _transform(chunk, enc, callback) {
  var state = this._peekState;

  // buffer incoming chunks until we have enough for our peek
  state.buffer.push(chunk);
  state.bytes += chunk.length;

  // get more?
  if (state.bytes >= state.maxBytes) _peek(this, callback);
    else callback();
};


BufferPeekStream.prototype._flush = function _flush(callback) {
  if (this._peekState.peeked) callback();
    else _peek(this, callback);
};


function _peek(stream, callback) {
  var state = stream._peekState;

  var buffer = Buffer.concat(state.buffer);

  // emit exactly the number of bytes we wanted to peek
  stream.emit('peek', buffer.slice(0, state.maxBytes));

  stream.push(buffer);

  state.buffer = null;
  state.bytes = null;
  state.peeked = true;

  stream._transform = passthrough;

  callback();
}

function passthrough(chunk, enc, callback) {
  this.push(chunk);
  callback();
}