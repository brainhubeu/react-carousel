'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _shelljs = require('shelljs');

var _memoize2 = require('lodash/memoize');

var _memoize3 = _interopRequireDefault(_memoize2);

var _basename = require('basename');

var _basename2 = _interopRequireDefault(_basename);

var _findNodeModules = require('find-node-modules');

var _findNodeModules2 = _interopRequireDefault(_findNodeModules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// It's not super clean to mock this here, but i'm ok with this for now
var getNodeModulesContents = (0, _memoize3.default)(function (dir) {
  // eslint-disable-line arrow-body-style
  /* istanbul ignore next */
  return process.env.NODE_ENV === 'test' ? ['codecov', 'babel-cli'] : new Set((0, _shelljs.ls)(dir));
});

/**
 * Helpers
 */
var calculateIntersection = function calculateIntersection(set1, set2) {
  return new Set([].concat(_toConsumableArray(set1)).filter(function (x) {
    return set2.has(x);
  }));
};

var basenameCached = (0, _memoize3.default)(_basename2.default);

var cachedBasenameLs = (0, _memoize3.default)(function (dir) {
  // TODO: Refactor this to use webpacks `modulesDirectories` somehow
  var files = (0, _shelljs.ls)(dir + '/*{.json,.js,.jsx,.ts}');
  var folders = (0, _shelljs.ls)('-d', dir + '/*/');
  var both = [].concat(_toConsumableArray(files), _toConsumableArray(folders));
  return new Set(both.map(basenameCached));
});

var customJoi = _joi2.default.extend({
  base: _joi2.default.string(),
  name: 'path',
  language: {
    noRootFilesNodeModulesNameClash: '\n\nWhen looking at files/folders in the root path "{{path}}",\n' + 'I found out that there are files/folders that name clash with ' + 'dependencies in your node_modules ({{nodeModuleFolder}}).\n' + 'The clashing files/folders (extensions removed) are: {{conflictingFiles}}.\n' + 'This can lead to hard to debug errors, where you for example have ' + 'a folder "$rootDir/redux", then `require("redux")` and, instead of resolving ' + 'the npm package "redux", *the folder "$rootDir/redux" is resolved.*\n' + 'SOLUTION: rename the clashing files/folders.\n\n'
  },
  rules: [{
    name: 'noRootFilesNodeModulesNameClash',

    validate: function validate(params, path_, state, options) {
      // If the supplied resolve.root path *is* a node_module folder, we'll continue
      // The check doesn't make sense in that case
      if (/node_modules$/.test(path_)) {
        return null;
      }
      // For an initial iteration this node_module resolving is quite simplistic;
      // it just takes the first node_module folder found looking upwards from the given root
      var nodeModuleFolder = (0, _findNodeModules2.default)({ cwd: path_, relative: false })[0];
      /* istanbul ignore if - it's hard to simulate this */
      if (!nodeModuleFolder) {
        return null;
      }
      var nodeModules = getNodeModulesContents(nodeModuleFolder);
      var basenames = cachedBasenameLs(path_);
      var intersection = calculateIntersection(nodeModules, basenames);
      if (intersection.size > 0) {
        return this.createError('path.noRootFilesNodeModulesNameClash', {
          path: path_,
          conflictingFiles: JSON.stringify([].concat(_toConsumableArray(intersection))),
          nodeModuleFolder: nodeModuleFolder
        }, state, options);
      }
      return null; // Everything is OK
    }
  }]
});

exports.default = customJoi.path().noRootFilesNodeModulesNameClash();