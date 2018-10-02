'use strict';

var path = require('path');
var validate = require('../').validateRoot;
var argv = require('yargs').argv;

module.exports = function validateConfig(webpackConfigFile, quiet) {
  if (!quiet) console.log('Reading: ' + webpackConfigFile);
  var webpackConfigPath = path.join(process.cwd(), webpackConfigFile);

  delete require.cache[require.resolve(webpackConfigPath)];

  var config = require(webpackConfigPath);
  var configToValidate = typeof config === 'function' ? config(argv.env, argv) : config;
  return validate(configToValidate, validate.schema, {
    returnValidation: true,
    quiet: quiet
  });
};