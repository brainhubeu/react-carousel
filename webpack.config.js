const { plugins, rules } = require('webpack-atoms');
const path = require('path');

module.exports = {
  resolve: {
    modules: [
      'node_modules',
      'example',
    ],
  },
  devtool: 'cheap-inline-module-source-map',
  entry: path.resolve(__dirname, 'example/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    pathinfo: true,
  },
  plugins: [
    plugins.define({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    }),
    plugins.html(),
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    stats: 'minimal',
  },
  module: {
    rules: [
      rules.js(),
      rules.fonts(),
      rules.images(),
      rules.css(),
      rules.sass(),
    ],
  },
};
