'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _types = require('../../types');

var _rules = require('../../rules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var rules = _ref.rules;
  return _joi2.default.object({
    alias: _joi2.default.object().pattern(/.+/, _joi2.default.string()),
    root: _joi2.default.array().items(rules['no-root-files-node-modules-nameclash'] ? _types.absolutePath.concat(_rules.noRootFilesNodeModulesNameClash) : _types.absolutePath).single(),
    modulesDirectories: _joi2.default.array().items(_joi2.default.string()),
    fallback: _joi2.default.array().items(_types.absolutePath).single(),
    extensions: _joi2.default.array().items([_joi2.default.string().regex(/\..+/), _joi2.default.string().valid('')]),
    packageMains: _joi2.default.array(),
    packageAlias: _joi2.default.string(),
    unsafeCache: [_joi2.default.array().items(_joi2.default.object().type(RegExp)).single(), _joi2.default.bool().valid(true)],
    // TODO: Angular config again. Is this valid?
    cache: _joi2.default.boolean()
  });
};