/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FilterDirectivesTransform
 * 
 * @format
 */

'use strict';

/**
 * A transform that removes any directives that were not present in the
 * original schema.
 */
function transform(context, schema) {
  return require('./GraphQLIRTransformer').transform(context, { Directive: visitDirective }, function () {
    return schema;
  });
}

/**
 * @internal
 *
 * Skip directives not defined in the original schema.
 */
function visitDirective(directive, state) {
  if (state.getDirectives().some(function (schemaDirective) {
    return schemaDirective.name === directive.name;
  })) {
    return directive;
  }
  return null;
}

module.exports = { transform: transform };