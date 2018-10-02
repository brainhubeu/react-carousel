/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule CodegenRunner
 * 
 * @format
 */

'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('immutable'),
    ImmutableMap = _require.Map;

/* eslint-disable no-console */

var CodegenRunner = function () {
  // parser => writers that are affected by it
  function CodegenRunner(options) {
    var _this = this;

    (0, _classCallCheck3['default'])(this, CodegenRunner);
    this.parsers = {};

    this.parserConfigs = options.parserConfigs;
    this.writerConfigs = options.writerConfigs;
    this.onlyValidate = options.onlyValidate;
    this._reporter = options.reporter;

    this.parserWriters = {};
    for (var _parser in options.parserConfigs) {
      this.parserWriters[_parser] = new Set();
    }

    var _loop = function _loop(_writer) {
      var config = options.writerConfigs[_writer];
      config.baseParsers && config.baseParsers.forEach(function (parser) {
        return _this.parserWriters[parser].add(_writer);
      });
      _this.parserWriters[config.parser].add(_writer);
    };

    for (var _writer in options.writerConfigs) {
      _loop(_writer);
    }
  }

  CodegenRunner.prototype.compileAll = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* () {
      // reset the parsers
      this.parsers = {};
      for (var parserName in this.parserConfigs) {
        try {
          yield this.parseEverything(parserName);
        } catch (e) {
          this._reporter.reportError('CodegenRunner.compileAll', e);
          return 'ERROR';
        }
      }

      var hasChanges = false;
      for (var writerName in this.writerConfigs) {
        var result = yield this.write(writerName);
        if (result === 'ERROR') {
          return 'ERROR';
        }
        if (result === 'HAS_CHANGES') {
          hasChanges = true;
        }
      }
      return hasChanges ? 'HAS_CHANGES' : 'NO_CHANGES';
    });

    function compileAll() {
      return _ref.apply(this, arguments);
    }

    return compileAll;
  })();

  CodegenRunner.prototype.compile = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (writerName) {
      var _this2 = this;

      var writerConfig = this.writerConfigs[writerName];

      var parsers = [writerConfig.parser];
      if (writerConfig.baseParsers) {
        writerConfig.baseParsers.forEach(function (parser) {
          return parsers.push(parser);
        });
      }
      // Don't bother resetting the parsers
      yield Promise.all(parsers.map(function (parser) {
        return _this2.parseEverything(parser);
      }));

      return yield this.write(writerName);
    });

    function compile(_x) {
      return _ref2.apply(this, arguments);
    }

    return compile;
  })();

  CodegenRunner.prototype.getDirtyWriters = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (filePaths) {
      var _this3 = this;

      var dirtyWriters = new Set();

      // Check if any files are in the output
      for (var configName in this.writerConfigs) {
        var config = this.writerConfigs[configName];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = filePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _filePath = _step.value;

            if (config.isGeneratedFile(_filePath)) {
              dirtyWriters.add(configName);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      var client = new (require('./GraphQLWatchmanClient'))();

      // Check for files in the input
      yield Promise.all(Object.keys(this.parserConfigs).map((() => {
        var _ref4 = (0, _asyncToGenerator3.default)(function* (parserConfigName) {
          var config = _this3.parserConfigs[parserConfigName];
          var dirs = yield client.watchProject(config.baseDir);

          var relativeFilePaths = filePaths.map(function (filePath) {
            return require('path').relative(config.baseDir, filePath);
          });

          var query = {
            expression: ['allof', config.watchmanExpression, ['name', relativeFilePaths, 'wholename']],
            fields: ['exists'],
            relative_root: dirs.relativePath
          };

          var result = yield client.command('query', dirs.root, query);
          if (result.files.length > 0) {
            _this3.parserWriters[parserConfigName].forEach(function (writerName) {
              return dirtyWriters.add(writerName);
            });
          }
        });

        return function (_x3) {
          return _ref4.apply(this, arguments);
        };
      })()));

      client.end();
      return dirtyWriters;
    });

    function getDirtyWriters(_x2) {
      return _ref3.apply(this, arguments);
    }

    return getDirtyWriters;
  })();

  CodegenRunner.prototype.parseEverything = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)(function* (parserName) {
      if (this.parsers[parserName]) {
        // no need to parse
        return;
      }

      var parserConfig = this.parserConfigs[parserName];
      this.parsers[parserName] = parserConfig.getParser(parserConfig.baseDir);
      var filter = parserConfig.getFileFilter ? parserConfig.getFileFilter(parserConfig.baseDir) : anyFileFilter;

      if (parserConfig.filepaths && parserConfig.watchmanExpression) {
        throw new Error('Provide either `watchmanExpression` or `filepaths` but not both.');
      }

      var files = void 0;
      if (parserConfig.watchmanExpression) {
        files = yield require('./CodegenWatcher').queryFiles(parserConfig.baseDir, parserConfig.watchmanExpression, filter);
      } else if (parserConfig.filepaths) {
        files = yield require('./CodegenWatcher').queryFilepaths(parserConfig.baseDir, parserConfig.filepaths, filter);
      } else {
        throw new Error('Either `watchmanExpression` or `filepaths` is required to query files');
      }
      this.parseFileChanges(parserName, files);
    });

    function parseEverything(_x4) {
      return _ref5.apply(this, arguments);
    }

    return parseEverything;
  })();

  CodegenRunner.prototype.parseFileChanges = function parseFileChanges(parserName, files) {
    var tStart = Date.now();
    var parser = this.parsers[parserName];
    // this maybe should be await parser.parseFiles(files);
    parser.parseFiles(files);
    var tEnd = Date.now();
    console.log('Parsed %s in %s', parserName, toSeconds(tStart, tEnd));
  };

  // We cannot do incremental writes right now.
  // When we can, this could be writeChanges(writerName, parserName, parsedDefinitions)


  CodegenRunner.prototype.write = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)(function* (writerName) {
      var _this4 = this;

      try {
        var combineChanges = function combineChanges(accessor) {
          var combined = [];
          require('fbjs/lib/invariant')(outputDirectories, 'CodegenRunner: Expected outputDirectories to be set');
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = outputDirectories.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var dir = _step2.value;

              combined.push.apply(combined, (0, _toConsumableArray3['default'])(accessor(dir.changes)));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return combined;
        };

        console.log('\nWriting %s', writerName);
        var tStart = Date.now();
        var _writerConfigs$writer = this.writerConfigs[writerName],
            _getWriter = _writerConfigs$writer.getWriter,
            _parser2 = _writerConfigs$writer.parser,
            _baseParsers = _writerConfigs$writer.baseParsers,
            _isGeneratedFile = _writerConfigs$writer.isGeneratedFile;


        var _baseDocuments = ImmutableMap();
        if (_baseParsers) {
          _baseParsers.forEach(function (baseParserName) {
            _baseDocuments = _baseDocuments.merge(_this4.parsers[baseParserName].documents());
          });
        }

        // always create a new writer: we have to write everything anyways
        var _documents = this.parsers[_parser2].documents();
        var _schema = this.parserConfigs[_parser2].getSchema();
        var _writer2 = _getWriter(this.onlyValidate, _schema, _documents, _baseDocuments);

        var outputDirectories = yield _writer2.writeAll();

        var tWritten = Date.now();

        var created = combineChanges(function (_) {
          return _.created;
        });
        var updated = combineChanges(function (_) {
          return _.updated;
        });
        var deleted = combineChanges(function (_) {
          return _.deleted;
        });
        var unchanged = combineChanges(function (_) {
          return _.unchanged;
        });

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = outputDirectories.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var dir = _step3.value;

            var all = [].concat((0, _toConsumableArray3['default'])(dir.changes.created), (0, _toConsumableArray3['default'])(dir.changes.updated), (0, _toConsumableArray3['default'])(dir.changes.deleted), (0, _toConsumableArray3['default'])(dir.changes.unchanged));

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = all[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var filename = _step4.value;

                var _filePath2 = dir.getPath(filename);
                require('fbjs/lib/invariant')(_isGeneratedFile(_filePath2), 'CodegenRunner: %s returned false for isGeneratedFile, ' + 'but was in generated directory', _filePath2);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                  _iterator4['return']();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
              _iterator3['return']();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        if (this.onlyValidate) {
          printFiles('Missing', created);
          printFiles('Out of date', updated);
          printFiles('Extra', deleted);
        } else {
          printFiles('Created', created);
          printFiles('Updated', updated);
          printFiles('Deleted', deleted);
          console.log('Unchanged: %s files', unchanged.length);
        }

        console.log('Written %s in %s', writerName, toSeconds(tStart, tWritten));

        return created.length + updated.length + deleted.length > 0 ? 'HAS_CHANGES' : 'NO_CHANGES';
      } catch (e) {
        this._reporter.reportError('CodegenRunner.write', e);
        return 'ERROR';
      }
    });

    function write(_x5) {
      return _ref6.apply(this, arguments);
    }

    return write;
  })();

  CodegenRunner.prototype.watchAll = (() => {
    var _ref7 = (0, _asyncToGenerator3.default)(function* () {
      // get everything set up for watching
      yield this.compileAll();

      for (var parserName in this.parserConfigs) {
        yield this.watch(parserName);
      }
    });

    function watchAll() {
      return _ref7.apply(this, arguments);
    }

    return watchAll;
  })();

  CodegenRunner.prototype.watch = (() => {
    var _ref8 = (0, _asyncToGenerator3.default)(function* (parserName) {
      var _this5 = this;

      var parserConfig = this.parserConfigs[parserName];

      if (!parserConfig.watchmanExpression) {
        throw new Error('`watchmanExpression` is required to watch files');
      }

      // watchCompile starts with a full set of files as the changes
      // But as we need to set everything up due to potential parser dependencies,
      // we should prevent the first watch callback from doing anything.
      var firstChange = true;

      yield require('./CodegenWatcher').watchCompile(parserConfig.baseDir, parserConfig.watchmanExpression, parserConfig.getFileFilter ? parserConfig.getFileFilter(parserConfig.baseDir) : anyFileFilter, (() => {
        var _ref9 = (0, _asyncToGenerator3.default)(function* (files) {
          require('fbjs/lib/invariant')(_this5.parsers[parserName], 'Trying to watch an uncompiled parser config: %s', parserName);
          if (firstChange) {
            firstChange = false;
            return;
          }
          var dependentWriters = [];
          _this5.parserWriters[parserName].forEach(function (writer) {
            return dependentWriters.push(writer);
          });

          try {
            if (!_this5.parsers[parserName]) {
              // have to load the parser and make sure all of its dependents are set
              yield _this5.parseEverything(parserName);
            } else {
              _this5.parseFileChanges(parserName, files);
            }
            yield Promise.all(dependentWriters.map(function (writer) {
              return _this5.write(writer);
            }));
          } catch (error) {
            _this5._reporter.reportError('CodegenRunner.watch', error);
          }
          console.log('Watching for changes to %s...', parserName);
        });

        return function (_x7) {
          return _ref9.apply(this, arguments);
        };
      })());
      console.log('Watching for changes to %s...', parserName);
    });

    function watch(_x6) {
      return _ref8.apply(this, arguments);
    }

    return watch;
  })();

  return CodegenRunner;
}();

function anyFileFilter(file) {
  return true;
}

function toSeconds(t0, t1) {
  return ((t1 - t0) / 1000).toFixed(2) + 's';
}

function printFiles(label, files) {
  if (files.length > 0) {
    console.log(label + ':');
    files.forEach(function (file) {
      console.log(' - ' + file);
    });
  }
}

module.exports = CodegenRunner;