'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _watchOptions = require('../watchOptions');

var _watchOptions2 = _interopRequireDefault(_watchOptions);

var _types = require('../../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object({
  lazy: _joi2.default.boolean(),
  inline: _joi2.default.boolean(),
  stdin: _joi2.default.boolean(),
  open: _joi2.default.boolean(),
  info: _joi2.default.boolean(),
  quiet: _joi2.default.boolean(),
  https: _joi2.default.boolean(),
  key: _joi2.default.binary(),
  cert: _joi2.default.binary(),
  ca: [_joi2.default.binary(), _joi2.default.array().items(_joi2.default.binary())],
  contentBase: [_joi2.default.object(), _joi2.default.array(), _joi2.default.string()],
  historyApiFallback: _joi2.default.alternatives().try([_joi2.default.object(), _joi2.default.boolean()]),
  compress: _joi2.default.boolean(),
  port: _joi2.default.number(),
  public: _joi2.default.string(),
  host: _joi2.default.string(),
  publicPath: _types.urlPart,
  outputPath: _types.urlPart,
  filename: _types.notAbsolutePath,
  watchOptions: _watchOptions2.default,
  hot: _joi2.default.boolean(),
  stats: _joi2.default.alternatives().try([_joi2.default.object(), _joi2.default.string().valid(['none', 'errors-only', 'minimal', 'normal', 'verbose'])]),
  logLevel: _joi2.default.string().valid(['debug', 'info', 'warn', 'error', 'silent']),
  localAddress: _joi2.default.string().regex(/.*:[0-9]+/),
  noInfo: _joi2.default.boolean(),
  proxy: [_joi2.default.object(), _joi2.default.array(), _joi2.default.string()],
  setup: _joi2.default.func().arity(1),
  staticOptions: _joi2.default.object(),
  headers: _joi2.default.object()
});