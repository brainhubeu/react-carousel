/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayCompiler
 * @format
 */

'use strict';

var _require = require('./GraphQLCompilerPublic'),
    Compiler = _require.Compiler;

/**
 * For now, the `RelayCompiler` *is* the `GraphQLCompiler`, but we're creating
 * this aliasing module to provide for the possibility of divergence (as the
 * `RelayCompiler` becomes more specific, and the `GraphQLCompiler` becomes more
 * general).
 */


var RelayCompiler = Compiler;

module.exports = RelayCompiler;