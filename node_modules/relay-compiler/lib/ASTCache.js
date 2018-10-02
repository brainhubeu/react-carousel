/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ASTCache
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('immutable'),
    ImmutableMap = _require.Map;

var ASTCache = function () {
  function ASTCache(config) {
    (0, _classCallCheck3['default'])(this, ASTCache);
    this._documents = new Map();

    this._baseDir = config.baseDir;
    this._parse = config.parse;
  }

  // Short-term: we don't do subscriptions/delta updates, instead always use all definitions


  ASTCache.prototype.documents = function documents() {
    return ImmutableMap(this._documents);
  };

  // parse should return the set of changes


  ASTCache.prototype.parseFiles = function parseFiles(files) {
    var _this = this;

    var documents = ImmutableMap();

    files.forEach(function (file) {
      var doc = function () {
        try {
          return _this._parse(_this._baseDir, file);
        } catch (error) {
          throw new Error('Parse error: ' + error + ' in "' + file.relPath + '"');
        }
      }();

      if (!doc) {
        _this._documents['delete'](file.relPath);
        return;
      }

      documents = documents.set(file.relPath, doc);
      _this._documents.set(file.relPath, doc);
    });

    return documents;
  };

  return ASTCache;
}();

module.exports = ASTCache;