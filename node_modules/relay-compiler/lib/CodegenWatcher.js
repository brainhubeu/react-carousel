/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule CodegenWatcher
 * 
 * @format
 */
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let queryFiles = (() => {
  var _ref3 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, filter) {
    var client = new (require('./GraphQLWatchmanClient'))();

    var _ref = yield Promise.all([client.watchProject(baseDir), getFields(client)]),
        watchResp = _ref[0],
        fields = _ref[1];

    var resp = yield client.command('query', watchResp.root, {
      expression: expression,
      fields: fields,
      relative_root: watchResp.relativePath
    });
    client.end();
    return updateFiles(new Set(), baseDir, filter, resp.files);
  });

  return function queryFiles(_x, _x2, _x3) {
    return _ref3.apply(this, arguments);
  };
})();

let getFields = (() => {
  var _ref4 = (0, _asyncToGenerator3.default)(function* (client) {
    var fields = ['name', 'exists'];
    if (yield client.hasCapability('field-content.sha1hex')) {
      fields.push('content.sha1hex');
    }
    return fields;
  });

  return function getFields(_x4) {
    return _ref4.apply(this, arguments);
  };
})();

// For use when not using Watchman.


let queryFilepaths = (() => {
  var _ref5 = (0, _asyncToGenerator3.default)(function* (baseDir, filepaths, filter) {
    // Construct WatchmanChange objects as an intermediate step before
    // calling updateFiles to produce file content.
    var files = filepaths.map(function (filepath) {
      return {
        name: filepath,
        exists: true,
        'content.sha1hex': null
      };
    });
    return updateFiles(new Set(), baseDir, filter, files);
  });

  return function queryFilepaths(_x5, _x6, _x7) {
    return _ref5.apply(this, arguments);
  };
})();

/**
 * Provides a simplified API to the watchman API.
 * Given some base directory and a list of subdirectories it calls the callback
 * with watchman change events on file changes.
 */


let watch = (() => {
  var _ref6 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, callback) {
    var client = new (require('./GraphQLWatchmanClient'))();
    var watchResp = yield client.watchProject(baseDir);

    yield makeSubscription(client, watchResp.root, watchResp.relativePath, expression, callback);
  });

  return function watch(_x8, _x9, _x10) {
    return _ref6.apply(this, arguments);
  };
})();

let makeSubscription = (() => {
  var _ref7 = (0, _asyncToGenerator3.default)(function* (client, root, relativePath, expression, callback) {
    client.on('subscription', function (resp) {
      if (resp.subscription === SUBSCRIPTION_NAME) {
        callback(resp);
      }
    });
    var fields = yield getFields(client);
    yield client.command('subscribe', root, SUBSCRIPTION_NAME, {
      expression: expression,
      fields: fields,
      relative_root: relativePath
    });
  });

  return function makeSubscription(_x11, _x12, _x13, _x14, _x15) {
    return _ref7.apply(this, arguments);
  };
})();

/**
 * Further simplifies `watch` and calls the callback on every change with a
 * full list of files that match the conditions.
 */


let watchFiles = (() => {
  var _ref8 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, filter, callback) {
    var files = new Set();
    yield watch(baseDir, expression, function (changes) {
      if (!changes.files) {
        // Watchmen fires a change without files when a watchman state changes,
        // for example during an hg update.
        return;
      }
      files = updateFiles(files, baseDir, filter, changes.files);
      callback(files);
    });
  });

  return function watchFiles(_x16, _x17, _x18, _x19) {
    return _ref8.apply(this, arguments);
  };
})();

/**
 * Similar to watchFiles, but takes an async function. The `compile` function
 * is awaited and not called in parallel. If multiple changes are triggered
 * before a compile finishes, the latest version is called after the compile
 * finished.
 *
 * TODO: Consider changing from a Promise to abortable, so we can abort mid
 *       compilation.
 */


let watchCompile = (() => {
  var _ref9 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, filter, compile) {
    var compiling = false;
    var needsCompiling = false;
    var latestFiles = null;

    watchFiles(baseDir, expression, filter, (() => {
      var _ref10 = (0, _asyncToGenerator3.default)(function* (files) {
        needsCompiling = true;
        latestFiles = files;
        if (compiling) {
          return;
        }
        compiling = true;
        while (needsCompiling) {
          needsCompiling = false;
          yield compile(latestFiles);
        }
        compiling = false;
      });

      return function (_x24) {
        return _ref10.apply(this, arguments);
      };
    })());
  });

  return function watchCompile(_x20, _x21, _x22, _x23) {
    return _ref9.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SUBSCRIPTION_NAME = 'graphql-codegen';

function updateFiles(files, baseDir, filter, fileChanges) {
  var fileMap = new Map();
  files.forEach(function (file) {
    fileMap.set(file.relPath, file);
  });

  fileChanges.forEach(function (_ref2) {
    var name = _ref2.name,
        exists = _ref2.exists,
        hash = _ref2['content.sha1hex'];

    var file = {
      relPath: name,
      hash: hash || hashFile(require('path').join(baseDir, name))
    };
    if (exists && filter(file)) {
      fileMap.set(name, file);
    } else {
      fileMap['delete'](name);
    }
  });
  return new Set(fileMap.values());
}

function hashFile(filename) {
  var content = require('fs').readFileSync(filename);
  return require('crypto').createHash('sha1').update(content).digest('hex');
}

module.exports = {
  queryFiles: queryFiles,
  queryFilepaths: queryFilepaths,
  watch: watch,
  watchFiles: watchFiles,
  watchCompile: watchCompile
};