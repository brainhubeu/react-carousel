/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayRelayDirectiveTransform
 * 
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    CompilerContext = _require.CompilerContext,
    IRTransformer = _require.IRTransformer,
    getLiteralArgumentValues = _require.getLiteralArgumentValues;

var RELAY = 'relay';
var PLURAL = 'plural';
var SCHEMA_EXTENSION = 'directive @relay(\n  # Marks a connection field as containing nodes without \'id\' fields.\n  # This is used to silence the warning when diffing connections.\n  isConnectionWithoutNodeID: Boolean,\n\n  # Marks a fragment as intended for pattern matching (as opposed to fetching).\n  # Used in Classic only.\n  pattern: Boolean,\n\n  # Marks a fragment as being backed by a GraphQLList.\n  plural: Boolean,\n\n  # Marks a fragment spread which should be unmasked if provided false\n  mask: Boolean = true,\n\n  # Selectively pass variables down into a fragment. Only used in Classic.\n  variables: [String!],\n) on FRAGMENT_DEFINITION | FRAGMENT_SPREAD | INLINE_FRAGMENT | FIELD';

/**
 * A transform that extracts `@relay(plural: Boolean)` directives and converts
 * them to metadata that can be accessed at runtime.
 */
function transform(context) {
  return IRTransformer.transform(context, {
    Fragment: visitFragment
  }, function () {
    return {};
  } // empty state
  );
}

function visitFragment(fragment) {
  var relayDirective = fragment.directives.find(function (_ref) {
    var name = _ref.name;
    return name === RELAY;
  });
  if (!relayDirective) {
    return fragment;
  }

  var _getLiteralArgumentVa = getLiteralArgumentValues(relayDirective.args),
      plural = _getLiteralArgumentVa.plural;

  require('fbjs/lib/invariant')(plural === undefined || typeof plural === 'boolean', 'RelayRelayDirectiveTransform: Expected the %s argument to @%s to be ' + 'a boolean literal or not specified.', PLURAL, RELAY);
  return (0, _extends3['default'])({}, fragment, {
    directives: fragment.directives.filter(function (directive) {
      return directive !== relayDirective;
    }),
    metadata: (0, _extends3['default'])({}, fragment.metadata || {}, {
      plural: plural
    })
  });
}

module.exports = {
  RELAY: RELAY,
  SCHEMA_EXTENSION: SCHEMA_EXTENSION,
  transform: transform
};