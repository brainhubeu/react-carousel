"use strict";

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _webpackValidator = require("webpack-validator");

var _webpackValidator2 = _interopRequireDefault(_webpackValidator);

var _stripIndent = require("common-tags/lib/stripIndent");

var _stripIndent2 = _interopRequireDefault(_stripIndent);

var _apiRunnerNode = require("./api-runner-node");

var _apiRunnerNode2 = _interopRequireDefault(_apiRunnerNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We whitelist special config keys that are not part of a standard Webpack v1
// config but are in common usage. We should be able to completely remove this
// once we're on Webpack v3.
//
// For info on whitelisting with webpack-validator see:
// https://github.com/js-dxtools/webpack-validator#customizing
var validationWhitelist = _webpackValidator.Joi.object({
  stylus: _webpackValidator.Joi.any(),
  sassLoader: _webpackValidator.Joi.any(),
  sassResources: [_webpackValidator.Joi.string(), _webpackValidator.Joi.array().items(_webpackValidator.Joi.string())],
  responsiveLoader: _webpackValidator.Joi.any()
});

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(program, config, babelConfig, stage) {
    var validationState;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _apiRunnerNode2.default)(`modifyWebpackConfig`, {
              program,
              config,
              babelConfig,
              stage
            });

          case 2:

            // console.log(JSON.stringify(config, null, 4))

            (0, _invariant2.default)(_lodash2.default.isObject(config) && _lodash2.default.isFunction(config.resolve), `
    You must return an webpack-configurator instance when modifying the Webpack config.
    Returned: ${config}
    stage: ${stage}
    `);

            validationState = (0, _webpackValidator2.default)(config.resolve(), {
              returnValidation: true,
              schemaExtension: validationWhitelist
            });

            if (validationState.error) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", config);

          case 6:

            console.log(`There were errors with your webpack config:`);
            validationState.error.details.forEach(function (err, index) {
              console.log(`[${index + 1}]`);
              console.log(err.path);
              console.log(err.type, `,`, err.message);
              console.log(`\n`);
            });

            console.log(_stripIndent2.default`
    Your Webpack config does not appear to be valid. This could be because of
    something you added or a plugin. If you don't recognize the invalid keys listed
    above try removing plugins and rebuilding to identify the culprit.
  `);

            return _context.abrupt("return", process.exit(1));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function ValidateWebpackConfig(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  }

  return ValidateWebpackConfig;
}();
//# sourceMappingURL=webpack-modify-validate.js.map