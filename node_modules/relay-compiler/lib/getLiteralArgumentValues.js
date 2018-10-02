/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule getLiteralArgumentValues
 * 
 * @format
 */

'use strict';

// Copy of Variables type from '../../../react-relay/classic/tools/RelayTypes'
// Duplicating here rather than importing it since we can't take on a dependency
// outside of graphql-compiler.
function getLiteralArgumentValues(args) {
  var values = {};
  args.forEach(function (arg) {
    require('fbjs/lib/invariant')(arg.value.kind === 'Literal', 'getLiteralArgumentValues(): Expected all args to be literals.');
    values[arg.name] = arg.value.value;
  });
  return values;
}

module.exports = getLiteralArgumentValues;