'use strict';

var envPath = require('./PATH');
var isWindows = require('is-windows');
var path = require('path');
var fs = require('fs');
var bashPath;

function getPath() {
  return firstPath(envPath() || 'bash');
}

function firstPath(arr) {
  for (var i = 0; i < arr.length; i++) {
    var filepath = path.resolve(arr[i], 'bash');
    if (fs.existsSync(filepath)) {
      return filepath;
    }
    if (isWindows()) {
      if (fs.existsSync(filepath + '.cmd')) {
        return filepath + '.cmd';
      }
      if (fs.existsSync(filepath + '.exe')) {
        return filepath + '.exe';
      }
      if (fs.existsSync(filepath + '.bat')) {
        return filepath + '.bat';
      }
    }
  }
}

Object.defineProperty(module, 'exports', {
  get: function() {
    return bashPath || (bashPath = getPath());
  }
});
