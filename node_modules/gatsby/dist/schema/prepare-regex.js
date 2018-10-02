"use strict";

var _ = require(`lodash`);

module.exports = function (str) {
  var exploded = str.split(`/`);
  var regex = new RegExp(exploded.slice(1, -1).join(`/`), _.last(exploded));
  return regex;
};
//# sourceMappingURL=prepare-regex.js.map