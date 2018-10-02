'use strict';

exports.__esModule = true;

var _react = require('react');

var errorBoundary = function errorBoundary(element, errorCallback) {
  var isEvalFunc = typeof element === 'function';

  if (isEvalFunc && _react.Component.isPrototypeOf(element)) {
    var originalRender = element.prototype.render;
    element.prototype.render = function render() {
      try {
        return originalRender.apply(this, arguments);
      } catch (err) {
        setTimeout(function () {
          errorCallback(err);
        });

        return null;
      }
    };
  } else if (isEvalFunc) {
    return function wrappedPFC() {
      try {
        return element();
      } catch (err) {
        setTimeout(function () {
          errorCallback(err);
        });

        return null;
      }
    };
  }

  return element;
};

exports.default = errorBoundary;
module.exports = exports['default'];