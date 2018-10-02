/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayFieldHandleTransform
 * 
 * @format
 */

'use strict';

// TODO T21875029 ../../relay-runtime/util/getRelayHandleKey

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    CompilerContext = _require.CompilerContext,
    IRTransformer = _require.IRTransformer;

function transform(context, schema) {
  return IRTransformer.transform(context, {
    LinkedField: visitField,
    ScalarField: visitField
  }, function () {
    return true;
  });
}

/**
 * @internal
 */
function visitField(field, state) {
  if (field.kind === 'LinkedField') {
    field = this.traverse(field, state);
  }
  var handles = field.handles;
  if (!handles || !handles.length) {
    return field;
  }
  // ensure exactly one handle
  require('fbjs/lib/invariant')(handles.length === 1, 'RelayFieldHandleTransform: Expected fields to have at most one ' + '"handle" property, got `%s`.', handles.join(', '));
  var alias = field.alias || field.name;
  var handle = handles[0];
  var name = require('./getRelayHandleKey')(handle.name, handle.key, field.name);
  var filters = handle.filters;
  var args = filters ? field.args.filter(function (arg) {
    return filters.indexOf(arg.name) > -1;
  }) : [];

  return (0, _extends3['default'])({}, field, {
    args: args,
    alias: alias,
    name: name,
    handles: null
  });
}

module.exports = { transform: transform };