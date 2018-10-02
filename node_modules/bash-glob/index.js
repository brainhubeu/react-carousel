'use strict';

var fs = require('fs');
var path = require('path');
var isGlob = require('is-glob');
var each = require('async-each');
var spawn = require('cross-spawn');
var isExtglob = require('is-extglob');
var extend = require('extend-shallow');
var Emitter = require('component-emitter');
var bashPath = require('bash-path');

/**
 * Asynchronously returns an array of files that match the given pattern
 * or patterns.
 *
 * ```js
 * var glob = require('bash-glob');
 * glob('*.js', function(err, files) {
 *   if (err) return console.log(err);
 *   console.log(files);
 * });
 * ```
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` Options to pass to bash. See available [options](#options).
 * @param {Function} `cb` Callback function, with `err` and `files` array.
 * @api public
 */

function glob(pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (Array.isArray(pattern)) {
    return glob.each.apply(glob, arguments);
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  if (typeof pattern !== 'string') {
    cb(new TypeError('expected glob to be a string or array'));
    return;
  }

  var opts = createOptions(pattern, options);
  bash(pattern, opts, function(err, files) {
    if (err instanceof Error) {
      cb(err);
      return;
    }

    if (!files) {
      files = err;
    }

    if (Array.isArray(files) && !files.length && opts.nullglob) {
      files = [pattern];
    }

    glob.emit('files', files, opts.cwd);

    if (!opts.each) {
      glob.end(files);
    }

    cb(null, files);
  });

  return glob;
}

/**
 * Mixin `Emitter` methods
 */

Emitter(glob);

/**
 * Asynchronously glob an array of files that match any of the given `patterns`.
 *
 * ```js
 * var glob = require('bash-glob');
 * glob.each(['*.js', '*.md'], {dot: true}, function(err, files) {
 *   if (err) return console.log(err);
 *   console.log(files);
 * });
 * ```
 * @param {String} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` Options to pass to bash. See available [options](#options).
 * @param {Function} `cb` Callback function, with `err` and `files` array.
 * @api public
 */

glob.each = function(patterns, options, cb) {
  if (typeof patterns === 'string') {
    return glob.apply(glob, arguments);
  }

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  if (!Array.isArray(patterns)) {
    cb(new TypeError('expected patterns to be a string or array'));
    return;
  }

  var acc = [];
  each(patterns, function(pattern, next) {
    var opts = extend({}, options, {each: true});
    glob(pattern, opts, function(err, files) {
      if (err) {
        next(err);
        return;
      }
      acc.push.apply(acc, files);
      next();
    });
  }, function(err) {
    if (err) {
      cb(err, []);
      return;
    }
    glob.end(acc);
    cb(null, acc);
  });

  return glob;
};

/**
 * Returns an array of files that match the given patterns or patterns.
 *
 * ```js
 * var glob = require('bash-glob');
 * console.log(glob.sync('*.js', {cwd: 'foo'}));
 * console.log(glob.sync(['*.js'], {cwd: 'bar'}));
 * ```
 * @param {String} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` Options to pass to bash. See available [options](#options).
 * @return {Array} Returns an array of files.
 * @api public
 */

glob.sync = function(pattern, options) {
  if (Array.isArray(pattern)) {
    return pattern.reduce(function(acc, pattern) {
      acc = acc.concat(glob.sync(pattern, options));
      return acc;
    }, []);
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('expected glob to be a string or array');
  }

  var opts = createOptions(pattern, options);

  try {
    var stat = fs.statSync(opts.cwd);
    if (!stat.isDirectory()) {
      throw new Error('cwd is not a directory: ' + opts.cwd);
    }
  } catch (error) {
    var err = handleError(error, pattern, opts, true);
    if (err instanceof Error) {
      throw err;
    }
    return err;
  }

  if (!isGlob(pattern)) {
    var fp = path.resolve(opts.cwd, pattern);
    return (opts.nullglob || fs.existsSync(fp)) ? [pattern] : [];
  }

  var cp = spawn.sync(bashPath, cmd(pattern, opts), opts);
  var error = cp.stderr ? String(cp.stderr).trim() : null;
  if (error) {
    err = handleError(error, pattern, opts);
    if (err instanceof Error) {
      throw err;
    }
    return err;
  }

  if (cp.stdout == null) {
    return [];
  }

  var files = getFiles(cp.stdout.toString(), pattern, opts);
  if (files instanceof Error) {
    throw files;
  }

  glob.emit('files', files, opts.cwd);
  glob.end(files);
  return files;
};

/**
 * Emit `end` and remove listeners
 */

glob.end = function(files) {
  glob.emit('end', files);
  glob.off('match');
  glob.off('files');
  glob.off('end');
};

/**
 * Base bash function
 */

function bash(pattern, options, cb) {
  if (!isGlob(pattern)) {
    return nonGlob(pattern, options, cb);
  }

  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }

  var opts = extend({cwd: process.cwd()}, options);

  fs.stat(opts.cwd, function(err, stat) {
    if (err) {
      cb(handleError(err, pattern, opts));
      return;
    }

    if (!stat.isDirectory()) {
      cb(new Error('cwd is not a directory: ' + opts.cwd));
      return;
    }

    var cp = spawn(bashPath, cmd(pattern, options), options);
    var buf = new Buffer(0);

    cp.stdout.on('data', function(data) {
      emitMatches(data.toString(), pattern, options);
      buf = Buffer.concat([buf, data]);
    });

    cp.stderr.on('data', function(data) {
      cb(handleError(data.toString(), pattern, options));
    });

    cp.on('close', function(code) {
      cb(code, getFiles(buf.toString(), pattern, options));
    });
  });

  return glob;
}

/**
 * Escape spaces in glob patterns
 */

function normalize(val) {
  if (Array.isArray(val)) {
    var len = val.length;
    var idx = -1;
    while (++idx < len) {
      val[idx] = normalize(val[idx]);
    }
    return val.join(' ');
  }
  return val.split(' ').join('\\ ');
}

/**
 * Create the command to use
 */

function cmd(patterns, options) {
  var str = normalize(patterns);
  var valid = ['dotglob', 'extglob', 'failglob', 'globstar', 'nocaseglob', 'nullglob'];
  var args = [];
  for (var key in options) {
    if (options.hasOwnProperty(key) && valid.indexOf(key) !== -1) {
      args.push('-O', key);
    }
  }
  args.push('-c', `for i in ${str}; do echo $i; done`);
  return args;
}

/**
 * Shallow clone and create options
 */

function createOptions(pattern, options) {
  if (options && options.normalized === true) return options;
  var opts = extend({cwd: process.cwd()}, options);
  if (opts.nocase === true) opts.nocaseglob = true;
  if (opts.nonull === true) opts.nullglob = true;
  if (opts.dot === true) opts.dotglob = true;
  if (!opts.hasOwnProperty('globstar') && pattern.indexOf('**') !== -1) {
    opts.globstar = true;
  }
  if (!opts.hasOwnProperty('extglob') && isExtglob(pattern)) {
    opts.extglob = true;
  }
  opts.normalized = true;
  return opts;
}

/**
 * Handle errors to ensure the correct value is returned based on options
 */

function handleError(err, pattern, options) {
  var message = err;
  if (typeof err === 'string') {
    err = new Error(message.trim());
    err.pattern = pattern;
    err.options = options;
    if (/invalid shell option/.test(err)) {
      err.code = 'INVALID_SHELL_OPTION';
    }
    if (/no match:/.test(err)) {
      err.code = 'NOMATCH';
    }
    return err;
  }

  if (err && (err.code === 'ENOENT' || err.code === 'NOMATCH')) {
    if (options.nullglob === true) {
      return [pattern];
    }
    if (options.failglob === true) {
      return err;
    }
    return [];
  }
  return err;
}

/**
 * Handle files to ensure the correct value is returned based on options
 */

function getFiles(res, pattern, options) {
  var files = res.split(/\r?\n/).filter(Boolean);
  if (files.length === 1 && files[0] === pattern) {
    files = [];
  } else if (options.realpath === true || options.follow === true) {
    files = toAbsolute(files, options);
  }
  if (files.length === 0) {
    if (options.nullglob === true) {
      return [pattern];
    }
    if (options.failglob === true) {
      return new Error('no matches:' + pattern);
    }
  }
  return files;
}

/**
 * Make symlinks absolute when `options.follow` is defined.
 */

function toAbsolute(files, options) {
  var len = files.length;
  var idx = -1;
  var arr = [];

  while (++idx < len) {
    var file = files[idx];
    if (!file.trim()) continue;
    if (file && options.cwd) {
      file = path.resolve(options.cwd, file);
    }
    if (file && options.realpath === true) {
      file = follow(file);
    }
    if (file) {
      arr.push(file);
    }
  }
  return arr;
}

/**
 * Handle callback
 */

function callback(files, pattern, options, cb) {
  return function(err) {
    if (err) {
      cb(handleError(err, pattern, options), []);
      return;
    }
    cb(null, files || [pattern]);
  };
}

/**
 * Follow symlinks
 */

function follow(filepath) {
  if (!isSymlink(filepath) && !fs.existsSync(filepath)) {
    return false;
  }
  return filepath;
}

function isSymlink(filepath) {
  try {
    return fs.lstatSync(filepath).isSymbolicLink();
  } catch (err) {}
  return null;
}

/**
 * Handle non-globs
 */

function nonGlob(pattern, options, cb) {
  if (options.nullglob) {
    cb(null, [pattern]);
    return;
  }
  fs.stat(pattern, callback(null, pattern, options, cb));
  return;
}

/**
 * Emit matches for a pattern
 */

function emitMatches(str, pattern, options) {
  glob.emit('match', getFiles(str, pattern, options), options.cwd);
}

/**
 * Expose `glob`
 */

module.exports = exports = glob;
