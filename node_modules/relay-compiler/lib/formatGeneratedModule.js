/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule formatGeneratedModule
 * 
 * @format
 */

'use strict';

var formatGeneratedModule = function formatGeneratedModule(_ref) {
  var moduleName = _ref.moduleName,
      documentType = _ref.documentType,
      docText = _ref.docText,
      concreteText = _ref.concreteText,
      flowText = _ref.flowText,
      hash = _ref.hash,
      devTextGenerator = _ref.devTextGenerator,
      relayRuntimeModule = _ref.relayRuntimeModule;

  var objectName = documentType === 'ConcreteBatch' ? 'batch' : 'fragment';
  var docTextComment = docText ? '\n/*\n' + docText.trim() + '\n*/\n' : '';
  var hashText = hash ? '\n * ' + hash : '';
  var devOnlyText = devTextGenerator ? devTextGenerator(objectName) : '';
  return '/**\n * ' + '@' + 'flow' + hashText + '\n */\n\n/* eslint-disable */\n\n\'use strict\';\n\n/*::\nimport type {' + documentType + '} from \'' + relayRuntimeModule + '\';\n' + (flowText || '') + '\n*/\n\n' + docTextComment + '\nconst ' + objectName + ' /*: ' + documentType + '*/ = ' + concreteText + ';\n' + devOnlyText + '\nmodule.exports = ' + objectName + ';\n';
};

module.exports = formatGeneratedModule;