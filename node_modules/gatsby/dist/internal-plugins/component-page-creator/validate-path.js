"use strict";

var systemPath = require(`path`);

var tsDeclarationExtTest = /\.d\.tsx?$/;

function isTestFile(path) {
  var testFileTest = new RegExp(`(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$`);
  return path.match(testFileTest);
}

module.exports = function (path) {
  // Disallow paths starting with an underscore
  // and template-.
  // and .d.ts
  var parsedPath = systemPath.parse(path);
  return parsedPath.name.slice(0, 1) !== `_` && parsedPath.name.slice(0, 9) !== `template-` && !tsDeclarationExtTest.test(parsedPath.base) && !isTestFile(parsedPath.base);
};
//# sourceMappingURL=validate-path.js.map