/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/lib'),
    library: 'relay-debugger-react-native-runtime',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: __dirname,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          presets: ['es2017', 'es2016', 'es2015'],
        },
      },
    ],
  },
  devtool: 'eval',
};
