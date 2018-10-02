/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayConcreteNode
 * 
 * @format
 */

'use strict';

/**
 * Represents a single ConcreteRoot along with metadata for processing it at
 * runtime. The persisted `id` (or `text`) can be used to fetch the query,
 * the `fragment` can be used to read the root data (masking data from child
 * fragments), and the `query` can be used to normalize server responses.
 *
 * NOTE: The use of "batch" in the name is intentional, as this wrapper around
 * the ConcreteRoot will provide a place to store multiple concrete nodes that
 * are part of the same batch, e.g. in the case of deferred nodes or
 * for streaming connections that are represented as distinct concrete roots but
 * are still conceptually tied to one source query.
 */
var RelayConcreteNode = {
  CONDITION: 'Condition',
  FRAGMENT: 'Fragment',
  FRAGMENT_SPREAD: 'FragmentSpread',
  INLINE_FRAGMENT: 'InlineFragment',
  LINKED_FIELD: 'LinkedField',
  LINKED_HANDLE: 'LinkedHandle',
  LITERAL: 'Literal',
  LOCAL_ARGUMENT: 'LocalArgument',
  ROOT: 'Root',
  ROOT_ARGUMENT: 'RootArgument',
  SCALAR_FIELD: 'ScalarField',
  SCALAR_HANDLE: 'ScalarHandle',
  VARIABLE: 'Variable'
};

module.exports = RelayConcreteNode;