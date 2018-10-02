/*!
 * postcss-color-gray | MIT (c) Shinnosuke Watanabe
 * https://github.com/postcss/postcss-color-gray
*/

'use strict';

var color = require('color');
var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var reduceFunctionCall = require('reduce-function-call');

var pluginName = 'postcss-color-gray';
var errorContext = {plugin: pluginName};

function parseAlpha(alpha) {
  if (alpha) {
    var match = alpha.match(/^\d(\d|\.)+?%$/);
    if (match && match[0] === alpha) {
      return parseFloat(alpha) * 0.01;
    }
  }
  return alpha;
}

function parseGray(decl) {
  return reduceFunctionCall(decl.value, 'gray', function(body) {
    if (/^,/.test(body) || /,$/.test(body)) {
      throw decl.error(
        'Unable to parse color from string "gray(' + body + ')"',
        errorContext
      );
    }
    var fn = 'rgb';
    var args = postcss.list.comma(body);
    var lightness = args[0];
    var rgb = [lightness, lightness, lightness];
    var alpha = parseAlpha(args[1]);
    if (alpha) {
      fn += 'a';
      rgb.push(alpha);
    }
    try {
      return color(fn + '(' + rgb + ')').rgbString();
    } catch (err) {
      var message = err.message.replace(/rgba?\(.*\)/, 'gray(' + args + ')');
      throw decl.error(message, errorContext);
    }
  });
}

module.exports = postcss.plugin(pluginName, function() {
  return function(root) {
    root.walkDecls(function(decl) {
      if (decl.value && decl.value.indexOf('gray(') !== -1) {
        decl.value = helpers.try(parseGray.bind(this, decl), decl.source);
      }
    });
  };
});
