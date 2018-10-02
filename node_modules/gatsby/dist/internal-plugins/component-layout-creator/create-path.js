"use strict";

var _parseFilepath = require("parse-filepath");

var _parseFilepath2 = _interopRequireDefault(_parseFilepath);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _slash = require("slash");

var _slash2 = _interopRequireDefault(_slash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (basePath, filePath) {
  var relativePath = _path2.default.posix.relative((0, _slash2.default)(basePath), (0, _slash2.default)(filePath));

  var _parsePath = (0, _parseFilepath2.default)(relativePath),
      dirname = _parsePath.dirname,
      name = _parsePath.name;

  return _path2.default.posix.join(dirname, name);
};
//# sourceMappingURL=create-path.js.map