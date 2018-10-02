"use strict";

exports.__esModule = true;
exports.joinPath = joinPath;
exports.withBasePath = withBasePath;
var path = require(`path`);
var os = require(`os`);

function joinPath() {
  var joinedPath = path.join.apply(path, arguments);
  if (os.platform() === `win32`) {
    return joinedPath.replace(/\\/g, `\\\\`);
  } else {
    return joinedPath;
  }
}

function withBasePath(basePath) {
  return function () {
    for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
      paths[_key] = arguments[_key];
    }

    return joinPath.apply(undefined, [basePath].concat(paths));
  };
}
//# sourceMappingURL=path.js.map