'use strict';

var Readable = require('stream').Readable;
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var normalizeOptions = require('./normalize-options');
var stat = require('./stat');

module.exports = DirectoryReader;

/**
 * Asynchronously reads the contents of a directory and streams the results
 * via a {@link stream.Readable}.
 *
 * @param {string} dir - The absolute or relative directory path to read
 * @param {object} [options] - User-specified options, if any (see {@link normalizeOptions})
 * @param {object} internalOptions - Internal options that aren't part of the public API
 * @class
 */
function DirectoryReader (dir, options, internalOptions) {
  var reader = this;

  reader.options = options = normalizeOptions(options, internalOptions);

  // Indicates whether we should keep reading
  // This is set false if stream.Readable.push() returns false.
  reader.shouldRead = true;

  // The directories to read
  // (initialized with the top-level directory)
  reader.queue = [{
    path: dir,
    basePath: options.basePath,
    posixBasePath: options.posixBasePath,
    depth: 0
  }];

  // The number of directories that are currently being processed
  reader.pending = 0;

  // The data that has been read, but not yet emitted
  reader.buffer = [];

  reader.stream = new Readable({ objectMode: true });
  reader.stream._read = function _read () {
    // Start (or resume) reading
    reader.shouldRead = true;

    // If we have data in the buffer, then send the next chunk
    if (reader.buffer.length > 0) {
      reader.pushFromBuffer();
    }

    // If we have directories queued, then start processing the next one
    if (reader.queue.length > 0) {
      reader.readNextDirectory();
    }

    reader.checkForEOF();
  };
}

/**
 * Reads the next directory in the queue
 */
DirectoryReader.prototype.readNextDirectory = function readNextDirectory () {
  var reader = this;
  var facade = reader.options.facade;
  var dir = reader.queue.shift();
  reader.pending++;

  // Read the directory listing
  facade.fs.readdir(dir.path, function (err, items) {
    if (err) {
      reader.emit('error', err);
      return reader.finishedReadingDirectory();
    }

    // Process each item in the directory (simultaneously, if async)
    facade.forEach(
      items,
      reader.processItem.bind(reader, dir),
      reader.finishedReadingDirectory.bind(reader, dir)
    );
  });
};

/**
 * This method is called after all items in a directory have been processed.
 *
 * NOTE: This does not necessarily mean that the reader is finished, since there may still
 * be other directories queued or pending.
 */
DirectoryReader.prototype.finishedReadingDirectory = function finishedReadingDirectory () {
  var reader = this;
  reader.pending--;

  if (reader.shouldRead) {
    // If we have directories queued, then start processing the next one
    if (reader.queue.length > 0) {
      reader.readNextDirectory();
    }

    reader.checkForEOF();
  }
};

/**
 * Determines whether the reader has finished processing all items in all directories.
 * If so, then the "end" event is fired (via {@Readable#push})
 */
DirectoryReader.prototype.checkForEOF = function checkForEOF () {
  var reader = this;

  if (reader.buffer.length === 0 &&   // The stuff we've already read
  reader.pending === 0 &&             // The stuff we're currently reading
  reader.queue.length === 0) {        // The stuff we haven't read yet
    // There's no more stuff!
    reader.stream.push(null);
  }
};

/**
 * Processes a single item in a directory.
 *
 * If the item is a directory, and `option.deep` is enabled, then the item will be added
 * to the directory queue.
 *
 * If the item meets the filter criteria, then it will be emitted to the reader's stream.
 *
 * @param {object} dir - A directory object from the queue
 * @param {string} item - The name of the item (name only, no path)
 * @param {function} done - A callback function that is called after the item has been processed
 */
DirectoryReader.prototype.processItem = function processItem (dir, item, done) {
  var reader = this;
  var stream = reader.stream;
  var options = reader.options;

  var itemPath = dir.basePath + item;
  var posixPath = dir.posixBasePath + item;
  var fullPath = path.join(dir.path, item);

  // If `options.deep` is a number, and we've already recursed to the max depth,
  // then there's no need to check fs.Stats to know if it's a directory.
  // If `options.deep` is a function, then we'll need fs.Stats
  var maxDepthReached = dir.depth >= options.recurseDepth;

  // Do we need to call `fs.stat`?
  var needStats =
    !maxDepthReached ||                                 // we need the fs.Stats to know if it's a directory
    options.stats ||                                    // the user wants fs.Stats objects returned
    options.recurseFn ||                                // we need fs.Stats for the recurse function
    options.filterFn ||                                 // we need fs.Stats for the filter function
    EventEmitter.listenerCount(stream, 'file') ||       // we need the fs.Stats to know if it's a file
    EventEmitter.listenerCount(stream, 'directory') ||  // we need the fs.Stats to know if it's a directory
    EventEmitter.listenerCount(stream, 'symlink');      // we need the fs.Stats to know if it's a symlink

  // If we don't need stats, then exit early
  if (!needStats) {
    if (reader.filter(itemPath, posixPath)) {
      reader.pushOrBuffer({ data: itemPath });
    }
    return done();
  }

  // Get the fs.Stats object for this path
  stat(options.facade.fs, fullPath, function (err, stats) {
    if (err) {
      reader.emit('error', err);
      return done();
    }

    // Add the item's path to the fs.Stats object
    // The base of this path, and its separators are determined by the options
    // (i.e. options.basePath and options.sep)
    stats.path = itemPath;

    if (reader.shouldRecurse(stats, posixPath, maxDepthReached)) {
      // Add this subdirectory to the queue
      reader.queue.push({
        path: fullPath,
        basePath: itemPath + options.sep,
        posixBasePath: posixPath + '/',
        depth: dir.depth + 1,
      });
    }

    // Determine whether this item matches the filter criteria
    if (reader.filter(stats, posixPath)) {
      reader.pushOrBuffer({
        data: options.stats ? stats : itemPath,
        file: stats.isFile(),
        directory: stats.isDirectory(),
        symlink: stats.isSymbolicLink(),
      });
    }

    done();
  });
};

/**
 * Pushes the given chunk of data to the stream, or adds it to the buffer,
 * depending on the state of the stream.
 *
 * @param {object} chunk
 */
DirectoryReader.prototype.pushOrBuffer = function pushOrBuffer (chunk) {
  var reader = this;

  // Add the chunk to the buffer
  reader.buffer.push(chunk);

  // If we're still reading, then immediately emit the next chunk in the buffer
  // (which may or may not be the chunk that we just added)
  if (reader.shouldRead) {
    reader.pushFromBuffer();
  }
};

/**
 * Immediately pushes the next chunk in the buffer to the reader's stream.
 * The "data" event will always be fired (via {@link Readable#push}).
 * In addition, the "file", "directory", and/or "symlink" events may be fired,
 * depending on the type of properties of the chunk.
 */
DirectoryReader.prototype.pushFromBuffer = function pushFromBuffer () {
  var reader = this;
  var stream = reader.stream;
  var chunk = reader.buffer.shift();

  // Stream the data
  try {
    this.shouldRead = stream.push(chunk.data);
  }
  catch (error) {
    reader.emit('error', error);
  }

  // Also emit specific events, based on the type of chunk
  chunk.file && reader.emit('file', chunk.data);
  chunk.symlink && reader.emit('symlink', chunk.data);
  chunk.directory && reader.emit('directory', chunk.data);
};

/**
 * Determines whether the given directory meets the user-specified recursion criteria.
 * If the user didn't specify recursion criteria, then this function will default to true.
 *
 * @param {fs.Stats} stats - The directory's {@link fs.Stats} object
 * @param {string} posixPath - The item's POSIX path (used for glob matching)
 * @param {boolean} maxDepthReached - Whether we've already crawled the user-specified depth
 * @returns {boolean}
 */
DirectoryReader.prototype.shouldRecurse = function shouldRecurse (stats, posixPath, maxDepthReached) {
  var reader = this;
  var options = reader.options;

  if (maxDepthReached) {
    // We've already crawled to the maximum depth. So no more recursion.
    return false;
  }
  else if (!stats.isDirectory()) {
    // It's not a directory. So don't try to crawl it.
    return false;
  }
  else if (options.recurseGlob) {
    // Glob patterns are always tested against the POSIX path, even on Windows
    // https://github.com/isaacs/node-glob#windows
    return options.recurseGlob.test(posixPath);
  }
  else if (options.recurseRegExp) {
    // Regular expressions are tested against the normal path
    // (based on the OS or options.sep)
    return options.recurseRegExp.test(stats.path);
  }
  else if (options.recurseFn) {
    // Run the user-specified recursion criteria (and handle any errors)
    try {
      return options.recurseFn.call(null, stats);
    }
    catch (error) {
      reader.emit('error', error);
    }
  }
  else {
    // No recursion function was specified, and we're within the maximum depth.
    // So crawl this directory.
    return true;
  }
};

/**
 * Determines whether the given item meets the user-specified filter criteria.
 * If the user didn't specify a filter, then this function will always return true.
 *
 * @param {string|fs.Stats} value - Either the item's path, or the item's {@link fs.Stats} object
 * @param {string} posixPath - The item's POSIX path (used for glob matching)
 * @returns {boolean}
 */
DirectoryReader.prototype.filter = function filter (value, posixPath) {
  var reader = this;
  var options = reader.options;

  if (options.filterGlob) {
    // Glob patterns are always tested against the POSIX path, even on Windows
    // https://github.com/isaacs/node-glob#windows
    return options.filterGlob.test(posixPath);
  }
  else if (options.filterRegExp) {
    // Regular expressions are tested against the normal path
    // (based on the OS or options.sep)
    return options.filterRegExp.test(value.path || value);
  }
  else if (options.filterFn) {
    // Run the user-specified filter function (and handle any errors)
    try {
      return options.filterFn.call(null, value);
    }
    catch (error) {
      reader.emit('error', error);
    }
  }
  else {
    // No filter was specified, so match everything
    return true;
  }
};

/**
 * Emits an event.  If one of the event listeners throws an error,
 * then an "error" event is emitted.
 *
 * @param {string} eventName
 * @param {*} data
 */
DirectoryReader.prototype.emit = function emit (eventName, data) {
  var stream = this.stream;

  try {
    stream.emit(eventName, data);
  }
  catch (error) {
    if (eventName === 'error') {
      // Don't recursively emit "error" events.
      // If the first one fails, then just throw
      throw error;
    }
    else {
      stream.emit('error', error);
    }
  }
};
