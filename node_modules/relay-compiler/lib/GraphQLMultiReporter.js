/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLMultiReporter
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var GraphQLMultiReporter = function () {
  function GraphQLMultiReporter() {
    (0, _classCallCheck3['default'])(this, GraphQLMultiReporter);

    for (var _len = arguments.length, reporters = Array(_len), _key = 0; _key < _len; _key++) {
      reporters[_key] = arguments[_key];
    }

    this._reporters = reporters;
  }

  GraphQLMultiReporter.prototype.reportError = function reportError(caughtLocation, error) {
    this._reporters.forEach(function (reporter) {
      reporter.reportError(caughtLocation, error);
    });
  };

  return GraphQLMultiReporter;
}();

module.exports = GraphQLMultiReporter;