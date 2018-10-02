/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule filterContextForNode
 * 
 * @format
 */

'use strict';

var _require = require('./GraphQLIRVisitor'),
    visit = _require.visit;

/**
 * Returns a GraphQLCompilerContext containing only the documents referenced
 * by and including the provided node.
 */
function filterContextForNode(node, context) {
  var queue = [node];
  var filteredContext = new (require('./GraphQLCompilerContext'))(context.schema).add(node);
  var visitorConfig = {
    FragmentSpread: function FragmentSpread(fragmentSpread) {
      var name = fragmentSpread.name;

      if (!filteredContext.get(name)) {
        var fragment = context.getFragment(name);
        filteredContext = filteredContext.add(fragment);
        queue.push(fragment);
      }
    }
  };
  while (queue.length) {
    visit(queue.pop(), visitorConfig);
  }
  return filteredContext;
}

module.exports = filterContextForNode;