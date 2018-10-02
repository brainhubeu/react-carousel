/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLWatchmanClient
 * 
 * @format
 */
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var GraphQLWatchmanClient = function () {
  GraphQLWatchmanClient.isAvailable = function isAvailable() {
    return new Promise(function (resolve) {
      var client = new GraphQLWatchmanClient();
      client.on('error', function () {
        resolve(false);
        client.end();
      });
      client.hasCapability('relative_root').then(function (hasRelativeRoot) {
        resolve(hasRelativeRoot);
        client.end();
      }, function () {
        resolve(false);
        client.end();
      });
    });
  };

  function GraphQLWatchmanClient() {
    (0, _classCallCheck3['default'])(this, GraphQLWatchmanClient);

    this._client = new (require('fb-watchman').Client)();
  }

  GraphQLWatchmanClient.prototype.command = function command() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      _this._client.command(args, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  };

  GraphQLWatchmanClient.prototype.hasCapability = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (capability) {
      var resp = yield this.command('list-capabilities');
      return resp.capabilities.includes(capability);
    });

    function hasCapability(_x) {
      return _ref.apply(this, arguments);
    }

    return hasCapability;
  })();

  GraphQLWatchmanClient.prototype.watchProject = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (baseDir) {
      var resp = yield this.command('watch-project', baseDir);
      if ('warning' in resp) {
        console.error('Warning:', resp.warning);
      }
      return {
        root: resp.watch,
        relativePath: resp.relative_path
      };
    });

    function watchProject(_x2) {
      return _ref2.apply(this, arguments);
    }

    return watchProject;
  })();

  GraphQLWatchmanClient.prototype.on = function on(event, callback) {
    this._client.on(event, callback);
  };

  GraphQLWatchmanClient.prototype.end = function end() {
    this._client.end();
  };

  return GraphQLWatchmanClient;
}();

module.exports = GraphQLWatchmanClient;