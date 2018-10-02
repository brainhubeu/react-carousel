'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpackConfig = webpackConfig;
exports.nodeEnv = nodeEnv;
function webpackConfig(script) {
  var callsWebpackCli = script.split(' ').indexOf('webpack') !== -1;
  if (!callsWebpackCli) return undefined;

  // Try to parse webpack config name. Not fool proof. Maybe
  // there's a neater way.
  var parts = script.split('--config');

  if (parts.length > 1) {
    // Pick the last part, trim and split to extract
    return parts[parts.length - 1].trim().split(' ')[0];
  }

  return 'webpack.config.js';
}

function nodeEnv(script) {
  var parsedScript = script.indexOf('SET ') === 0 ? script.split('SET ')[1] : script;

  var parts = parsedScript.split('NODE_ENV=');

  if (parts.length < 2) {
    return '';
  }

  var ret = parts[1];

  if (ret.indexOf('&&') >= 0) {
    return ret.split('&&')[0].trim();
  }

  return ret.split(' ')[0].trim();
}