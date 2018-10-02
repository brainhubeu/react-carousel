"use strict";

var _ = require(`lodash`);

var seenNames = {};

module.exports = function createTypeName(name) {
  var cameledName = _.camelCase(name);
  if (seenNames[cameledName]) {
    seenNames[cameledName] += 1;
    return `${cameledName}_${seenNames[cameledName]}`;
  } else {
    seenNames[cameledName] = 1;
    return cameledName;
  }
};
//# sourceMappingURL=create-type-name.js.map