'use strict';

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _module = require('./properties/module');

var _module2 = _interopRequireDefault(_module);

var _entry = require('./properties/entry');

var _entry2 = _interopRequireDefault(_entry);

var _context = require('./properties/context');

var _context2 = _interopRequireDefault(_context);

var _devtool = require('./properties/devtool');

var _devtool2 = _interopRequireDefault(_devtool);

var _externals = require('./properties/externals');

var _externals2 = _interopRequireDefault(_externals);

var _node = require('./properties/node');

var _node2 = _interopRequireDefault(_node);

var _plugins = require('./properties/plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _resolve = require('./properties/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _output = require('./properties/output');

var _output2 = _interopRequireDefault(_output);

var _watchOptions = require('./properties/watchOptions');

var _watchOptions2 = _interopRequireDefault(_watchOptions);

var _devServer = require('./properties/devServer');

var _devServer2 = _interopRequireDefault(_devServer);

var _performance = require('./properties/performance');

var _performance2 = _interopRequireDefault(_performance);

var _types = require('./types');

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shelljs2.default.config.silent = true;

var defaultSchemaOptions = {
  rules: {
    'no-root-files-node-modules-nameclash': true,
    'loader-enforce-include-or-exclude': false,
    'loader-prefer-include': false
  }
};

function makeSchema(schemaOptions, schemaExtension) {
  var resolveSchema = (0, _resolve2.default)(schemaOptions);
  var moduleSchema = (0, _module2.default)(schemaOptions);

  var schema = _joi2.default.object({
    amd: _joi2.default.object(),
    bail: _joi2.default.boolean(),
    cache: _joi2.default.boolean(),
    context: _context2.default,
    debug: _joi2.default.boolean(),
    devServer: _devServer2.default,
    devtool: _devtool2.default,
    entry: _entry2.default,
    externals: _externals2.default,
    loader: _joi2.default.any(), // ?
    module: moduleSchema,
    node: _node2.default,
    output: _output2.default,
    plugins: _plugins2.default,
    profile: _joi2.default.boolean(),
    progress: _joi2.default.boolean(),
    recordsInputPath: _types.looksLikeAbsolutePath,
    recordsOutputPath: _types.looksLikeAbsolutePath,
    recordsPath: _types.looksLikeAbsolutePath,
    resolve: resolveSchema,
    resolveLoader: resolveSchema.concat(_joi2.default.object({
      moduleTemplates: _joi2.default.array().items(_joi2.default.string())
    })),
    watch: _joi2.default.boolean(),
    watchOptions: _watchOptions2.default,
    performance: _performance2.default,
    stats: _joi2.default.any(), // TODO
    target: _joi2.default.any(), // TODO

    // Plugins
    postcss: _joi2.default.any(),
    eslint: _joi2.default.any(),
    tslint: _joi2.default.any(),
    metadata: _joi2.default.any()
  });
  return schemaExtension ? schema.concat(schemaExtension) : schema;
}

function validate(config) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var returnValidation = options.returnValidation,
      overrideSchema = options.schema,
      schemaExtension = options.schemaExtension,
      rules = options.rules;


  var schemaOptions = (0, _merge3.default)(defaultSchemaOptions, { rules: rules });

  var schema = overrideSchema || makeSchema(schemaOptions, schemaExtension);

  var validationResult = _joi2.default.validate(config, schema, { abortEarly: false });
  validationResult.schemaOptions = schemaOptions; // Mainly for having sth to assert on right now

  if (returnValidation) return validationResult;

  if (validationResult.error) {
    console.error(validationResult.error.annotate());
    process.exit(1);
  }

  return config;
}

module.exports = validate;

// Easier consumability for require (default use case for non-transpiled webpack configs)
function validateRoot(config) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var quiet = options.quiet;


  var validationResult = void 0,
      multiValidationResults = void 0;

  if (Array.isArray(config)) {
    multiValidationResults = [];
    config.forEach(function (cfg) {
      multiValidationResults.push(validate(cfg, options));
    });
  } else {
    validationResult = validate(config, options);
  }

  if (!quiet) {
    console.info(_chalk2.default.green('[webpack-validator] Config is valid.'));
  }

  return validationResult || multiValidationResults;
}

module.exports.validateRoot = validateRoot;
module.exports.Joi = _joi2.default;