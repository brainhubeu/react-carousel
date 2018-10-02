"use strict";

var fs = require(`fs`);
var babylon = require(`babylon`);
var traverse = require(`babel-traverse`).default;
var get = require(`lodash/get`);

/**
 * Given a `require.resolve()` compatible path pointing to a JS module,
 * return an array listing the names of the module's exports.
 *
 * Returns [] for invalid paths and modules without exports.
 *
 * @param {string} modulePath
 * @param {function} resolver
 */
module.exports = function (modulePath) {
  var resolver = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require.resolve;

  var absPath = void 0;
  var exportNames = [];

  try {
    absPath = resolver(modulePath);
  } catch (err) {
    return exportNames; // doesn't exist
  }
  var code = fs.readFileSync(absPath, `utf8`); // get file contents

  var babylonOpts = {
    sourceType: `module`,
    allowImportExportEverywhere: true,
    plugins: [`jsx`, `doExpressions`, `objectRestSpread`, `decorators`, `classProperties`, `exportExtensions`, `asyncGenerators`, `functionBind`, `functionSent`, `dynamicImport`, `flow`]
  };

  var ast = babylon.parse(code, babylonOpts);

  // extract names of exports from file
  traverse(ast, {
    // get foo from `export const foo = bar`
    ExportNamedDeclaration: function ExportNamedDeclaration(astPath) {
      var exportName = get(astPath, `node.declaration.declarations[0].id.name`);
      if (exportName) exportNames.push(exportName);
    },
    AssignmentExpression: function AssignmentExpression(astPath) {
      var nodeLeft = astPath.node.left;

      if (nodeLeft.type !== `MemberExpression`) return;

      // get foo from `exports.foo = bar`
      if (get(nodeLeft, `object.name`) === `exports`) {
        exportNames.push(nodeLeft.property.name);
      }

      // get foo from `module.exports.foo = bar`
      if (get(nodeLeft, `object.object.name`) === `module` && get(nodeLeft, `object.property.name`) === `exports`) {
        exportNames.push(nodeLeft.property.name);
      }
    }
  });

  return exportNames;
};
//# sourceMappingURL=resolve-module-exports.js.map