'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOADERS_QUERY_MESSAGE = exports.CONDITION_MESSAGE = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  may be a RegExp (tested against absolute path),\n  a string containing the absolute path, a function(absPath): bool,\n  or an array of one of these combined with \u201Cand\u201D.'], ['\n  may be a RegExp (tested against absolute path),\n  a string containing the absolute path, a function(absPath): bool,\n  or an array of one of these combined with \u201Cand\u201D.']),
    _templateObject2 = _taggedTemplateLiteral(['\n  You can only pass the `query` property when you specify your\n  loader with the singular `loader` property'], ['\n  You can only pass the \\`query\\` property when you specify your\n  loader with the singular \\`loader\\` property']),
    _templateObject3 = _taggedTemplateLiteral(['!!\n  Please supply `include` or/and `exclude` to narrow down which\n  files will be processed by this loader.\n  Otherwise it\'s too easy\n  to process too many files, for example your `node_modules` (loader-enforce-include-or-exclude).\n'], ['!!\n  Please supply \\`include\\` or/and \\`exclude\\` to narrow down which\n  files will be processed by this loader.\n  Otherwise it\'s too easy\n  to process too many files, for example your \\`node_modules\\` (loader-enforce-include-or-exclude).\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  is required. You should use `include` to specify which files should be processed\n  by this loader. (loader-prefer-include)\n'], ['\n  is required. You should use \\`include\\` to specify which files should be processed\n  by this loader. (loader-prefer-include)\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  should not be used. Reason: `exclude` makes it easy to match too many files,\n  which might inadvertently slow your build down. Use `include` instead. (loader-prefer-include)\n'], ['\n  should not be used. Reason: \\`exclude\\` makes it easy to match too many files,\n  which might inadvertently slow your build down. Use \\`include\\` instead. (loader-prefer-include)\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  at position {{pos}} must be a String or an Object with properties:\n  "loader": (String, required),\n  "query": (Object, optional)\n'], ['\n  at position {{pos}} must be a String or an Object with properties:\n  "loader": (String, required),\n  "query": (Object, optional)\n']);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _commonTags = require('common-tags');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CONDITION_MESSAGE = exports.CONDITION_MESSAGE = (0, _commonTags.oneLine)(_templateObject);

var LOADERS_QUERY_MESSAGE = exports.LOADERS_QUERY_MESSAGE = (0, _commonTags.oneLine)(_templateObject2);

var LOADER_INCLUDE_OR_EXCLUDE_MESSAGE = (0, _commonTags.oneLine)(_templateObject3);

var LOADER_INCLUDE_REQUIRED = (0, _commonTags.oneLine)(_templateObject4);

var LOADER_EXCLUDE_FORBIDDEN = (0, _commonTags.oneLine)(_templateObject5);

var LOADER_IN_LOADERS_MESSAGE = (0, _commonTags.oneLine)(_templateObject6);

var conditionSchema = _joi2.default.array().items([_joi2.default.string(), _joi2.default.object().type(RegExp), _joi2.default.func().arity(1)]).single().options({ language: { array: { includesSingle: CONDITION_MESSAGE } } });

var loaderSchemaFn = function loaderSchemaFn(_ref) {
  var rules = _ref.rules;

  var rule = _joi2.default.object({
    test: conditionSchema.required(),
    exclude: conditionSchema,
    include: conditionSchema,
    loader: _joi2.default.string(),
    query: _joi2.default.object(),
    loaders: _joi2.default.array().items(_joi2.default.string(), _joi2.default.object({
      loader: _joi2.default.string().required(),
      query: _joi2.default.object()
    })).options({
      language: {
        array: {
          includes: LOADER_IN_LOADERS_MESSAGE
        }
      }
    })
  }).xor('loaders', 'loader').nand('loaders', 'query').options({ language: { object: { nand: LOADERS_QUERY_MESSAGE } } });

  if (rules['loader-enforce-include-or-exclude']) {
    rule = rule.or('exclude', 'include').label('loader').options({ language: { object: { missing: LOADER_INCLUDE_OR_EXCLUDE_MESSAGE } } });
  }

  if (rules['loader-prefer-include']) {
    rule = rule.concat(_joi2.default.object({
      include: conditionSchema.required(),
      exclude: _joi2.default.any().forbidden()
    }).options({
      language: {
        any: {
          required: LOADER_INCLUDE_REQUIRED,
          unknown: LOADER_EXCLUDE_FORBIDDEN
        }
      }
    }));
  }

  return rule;
};

exports.default = function (options) {
  var loaderSchema = loaderSchemaFn(options);
  var loadersSchema = _joi2.default.array().items(loaderSchema);
  return _joi2.default.object({
    loaders: loadersSchema.required(),
    preLoaders: loadersSchema,
    postLoaders: loadersSchema,
    noParse: _joi2.default.array(_joi2.default.object().type(RegExp)).single()
  });
};