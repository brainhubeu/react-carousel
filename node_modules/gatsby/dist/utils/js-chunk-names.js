"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require(`path`);

var _require = require(`../redux`),
    store = _require.store;

var generatePathChunkName = function generatePathChunkName(path) {
  var name = path === `/` ? `index` : _lodash2.default.kebabCase(path);
  return `path---${name}`;
};

var generateComponentChunkName = function generateComponentChunkName(componentPath) {
  var program = store.getState().program;
  var directory = `/`;
  if (program && program.directory) {
    directory = program.directory;
  }
  var name = path.relative(directory, componentPath);
  return `component---${_lodash2.default.kebabCase(name)}`;
};

exports.generatePathChunkName = generatePathChunkName;
exports.generateComponentChunkName = generateComponentChunkName;
//# sourceMappingURL=js-chunk-names.js.map