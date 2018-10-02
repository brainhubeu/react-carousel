'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _types = require('../../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object({
  filename: _types.notAbsolutePath,
  // don't check for existence here because it could be created in the build process
  path: _types.looksLikeAbsolutePath,
  publicPath: _joi2.default.alternatives().try([_types.urlPart, _joi2.default.string().valid('')]),
  chunkFilename: _types.notAbsolutePath,
  sourceMapFilename: _types.notAbsolutePath,
  devtoolModuleFilenameTemplate: [_types.notAbsolutePath, _joi2.default.func()],
  devtoolFallbackModuleFilenameTemplate: [_types.notAbsolutePath, _joi2.default.func()],
  devtoolLineToLine: _joi2.default.any(),
  hashDigestLength: _joi2.default.number(),
  hotUpdateChunkFilename: _types.notAbsolutePath,
  hotUpdateMainFilename: _types.notAbsolutePath,
  jsonpFunction: _joi2.default.string(),
  hotUpdateFunction: _joi2.default.string(),
  pathinfo: _joi2.default.bool(),
  library: [_types.notAbsolutePath, _joi2.default.array().items(_joi2.default.string())],
  libraryTarget: _joi2.default.string().valid(['var', 'this', 'commonjs', 'commonjs2', 'amd', 'umd']),
  umdNamedDefine: _joi2.default.bool(),
  sourcePrefix: _joi2.default.string(),
  crossOriginLoading: _joi2.default.alternatives().try([_joi2.default.bool().valid(false), _joi2.default.string().valid(['anonymous', 'use-credentials'])]).options({ language: { boolean: {
        base: 'should be `false`, "anonymous" or "use-credentials"' } } })
});