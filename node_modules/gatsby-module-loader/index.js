"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Based on Tobias Koppers @sokra bundle-loader
  https://github.com/webpack/bundle-loader

  and Arthur Stolyar's async-module-loader
*/
var loaderUtils = require("loader-utils");
var path = require("path");

module.exports = function () {};
module.exports.pitch = function (remainingRequest) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var chunkName = "";

  if (query.name) {
    chunkName = loaderUtils.interpolateName(this, query.name, {
      context: query.context,
      regExp: query.regExp
    });
    chunkName = ", " + (0, _stringify2.default)(chunkName);
  }

  var request = loaderUtils.stringifyRequest(this, "!!" + remainingRequest);

  var callback = "function() { return require(" + request + ") }";

  var executor = "return require.ensure([], function(_, error) {\n        if (error) {\n          console.log('bundle loading error', error)\n          cb(true)\n        } else {\n          cb(null, " + callback + ")\n        }\n      }" + chunkName + ");\n    ";

  var result = "require(\n      " + loaderUtils.stringifyRequest(this, "!" + path.join(__dirname, "patch.js")) + "\n    );\n    module.exports = function(cb) { " + executor + " }\n    ";

  return result;
};