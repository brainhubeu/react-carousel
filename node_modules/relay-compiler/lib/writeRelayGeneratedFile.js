/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule writeRelayGeneratedFile
 * 
 * @format
 */

'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

// TODO T21875029 ../../relay-runtime/util/RelayConcreteNode


/**
 * Generate a module for the given document name/text.
 */
let writeRelayGeneratedFile = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (codegenDir, generatedNode, formatModule, flowText, persistQuery, platform, relayRuntimeModule) {
    var moduleName = generatedNode.name + '.graphql';
    var platformName = platform ? moduleName + '.' + platform : moduleName;
    var filename = platformName + '.js';
    var flowTypeName = generatedNode.kind === 'Batch' ? 'ConcreteBatch' : 'ConcreteFragment';
    var devOnlyProperties = {};

    var text = null;
    var hash = null;
    if (generatedNode.kind === 'Batch') {
      text = generatedNode.text;
      require('fbjs/lib/invariant')(text, 'codegen-runner: Expected query to have text before persisting.');
      var oldContent = codegenDir.read(filename);
      // Hash the concrete node including the query text.
      var hasher = require('crypto').createHash('md5');
      hasher.update('cache-breaker-2');
      hasher.update(JSON.stringify(generatedNode));
      if (flowText) {
        hasher.update(flowText);
      }
      if (persistQuery) {
        hasher.update('persisted');
      }
      hash = hasher.digest('hex');
      if (hash === extractHash(oldContent)) {
        codegenDir.markUnchanged(filename);
        return null;
      }
      if (codegenDir.onlyValidate) {
        codegenDir.markUpdated(filename);
        return null;
      }
      if (persistQuery) {
        generatedNode = (0, _extends3['default'])({}, generatedNode, {
          text: null,
          id: yield persistQuery(text)
        });

        devOnlyProperties.text = text;
      }
    }

    var moduleText = formatModule({
      moduleName: moduleName,
      documentType: flowTypeName,
      docText: text,
      flowText: flowText,
      hash: hash ? '@relayHash ' + hash : null,
      concreteText: require('./prettyStringify')(generatedNode),
      devTextGenerator: makeDevTextGenerator(devOnlyProperties),
      relayRuntimeModule: relayRuntimeModule
    });

    codegenDir.writeFile(filename, moduleText);
    return generatedNode;
  });

  return function writeRelayGeneratedFile(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
// TODO T21875029 ../../relay-runtime/util/prettyStringify


function makeDevTextGenerator(devOnlyProperties) {
  return function (objectName) {
    var assignments = Object.keys(devOnlyProperties).map(function (key) {
      var value = devOnlyProperties[key];
      var stringifiedValue = value === undefined ? 'undefined' : JSON.stringify(value);

      return '  ' + objectName + '[\'' + key + '\'] = ' + stringifiedValue + ';';
    });

    if (!assignments.length) {
      return '';
    }

    return '\n\nif (__DEV__) {\n' + assignments.join('\n') + '\n}\n';
  };
}

function extractHash(text) {
  if (!text) {
    return null;
  }
  if (/<<<<<|>>>>>/.test(text)) {
    // looks like a merge conflict
    return null;
  }
  var match = text.match(/@relayHash (\w{32})\b/m);
  return match && match[1];
}

module.exports = writeRelayGeneratedFile;