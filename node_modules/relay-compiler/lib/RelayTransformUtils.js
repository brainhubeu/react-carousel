/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayTransformUtils
 * @format
 */

'use strict';

function hasUnaliasedSelection(field, fieldName) {
  return field.selections.some(function (selection) {
    return selection.kind === 'ScalarField' && selection.alias == null && selection.name === fieldName;
  });
}

module.exports = { hasUnaliasedSelection: hasUnaliasedSelection };