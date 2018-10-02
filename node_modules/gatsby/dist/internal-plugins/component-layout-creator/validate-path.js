"use strict";

var systemPath = require(`path`);

module.exports = function (path) {
  // Disallow paths starting with an underscore
  // and template-.
  var parsedPath = systemPath.parse(path);
  return parsedPath.name.slice(0, 1) !== `_` && parsedPath.name.slice(0, 9) !== `template-`;
};
//# sourceMappingURL=validate-path.js.map