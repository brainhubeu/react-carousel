/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayJSModuleParser
 * 
 * @format
 */

'use strict';

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    ASTCache = _require.ASTCache;

// Throws an error if parsing the file fails
function parseFile(baseDir, file) {
  var text = require('fs').readFileSync(require('path').join(baseDir, file.relPath), 'utf8');

  require('fbjs/lib/invariant')(text.indexOf('graphql') >= 0, 'RelayJSModuleParser: Files should be filtered before passed to the ' + 'parser, got unfiltered file `%s`.', file);

  var astDefinitions = [];
  require('./FindGraphQLTags').memoizedFind(text, baseDir, file).forEach(function (_ref) {
    var tag = _ref.tag,
        template = _ref.template;

    if (!(tag === 'graphql' || tag === 'graphql.experimental')) {
      throw new Error('Invalid tag ' + tag + ' in ' + file.relPath + '. Expected graphql``.');
    }

    if (tag === 'graphql.experimental') {
      console.warn(require('chalk').yellow('DEPRECATED: graphql.experimental`...` usage should be replaced ' + ('with graphql`...` in "' + file.relPath + '". No other changes are ') + 'needed. graphql.experimental will be removed in a future version.'));
    }

    var ast = require('graphql').parse(new (require('graphql').Source)(template, file.relPath));
    require('fbjs/lib/invariant')(ast.definitions.length, 'RelayJSModuleParser: Expected GraphQL text to contain at least one ' + 'definition (fragment, mutation, query, subscription), got `%s`.', template);

    astDefinitions.push.apply(astDefinitions, (0, _toConsumableArray3['default'])(ast.definitions));
  });

  return {
    kind: 'Document',
    definitions: astDefinitions
  };
}

function getParser(baseDir) {
  return new ASTCache({
    baseDir: baseDir,
    parse: parseFile
  });
}

function getFileFilter(baseDir) {
  return function (file) {
    var text = require('fs').readFileSync(require('path').join(baseDir, file.relPath), 'utf8');
    return text.indexOf('graphql') >= 0;
  };
}

module.exports = {
  getParser: getParser,
  getFileFilter: getFileFilter
};