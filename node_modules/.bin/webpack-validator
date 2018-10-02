#!/usr/bin/env node


'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var log = require('npmlog');
var validateAllScripts = require('./validate-all-scripts');
var validateConfig = require('./validate-config');
var configFile = void 0;

program.arguments('<configFileName>').option('-a, --all-scripts', 'Validate all configurations from package.json scripts').option('-q, --quiet', 'Quiet output').action(function (configFileName) {
  configFile = configFileName;
});
program.parse(process.argv);

function errorHandler(err) {
  if (err.isJoi && err.name === 'ValidationError' && err.annotate) {
    log.error(err.annotate());
  } else {
    log.error(err.message);
  }
  process.exit(1);
}

function validateFile(config, quiet) {
  fs.stat(configFile, function (err, stats) {
    if (err) {
      err.message = 'Could not find file "' + configFile + '"'; // eslint-disable-line no-param-reassign
      errorHandler(err);
    } else {
      if (stats.isFile()) {
        var validationResult = validateConfig(config, quiet);

        if (validationResult.error) {
          console.info(validationResult.error.annotate());
          process.exit(1);
        } else {
          if (!quiet) console.info(config + ' is valid');
          process.exit(0);
        }
      } else {
        var error = new Error('Could not find file "' + configFile + '"');
        error.type = 'EISDIR';
        errorHandler(error);
      }
    }
  });
}

if (program.allScripts) {
  var pkg = require(path.join(process.cwd(), './package.json'));

  validateAllScripts(pkg.scripts, program.quiet);
} else if (!configFile) {
  var error = new Error(['No configuration file given', 'Usage: webpack-validator-cli <configFileName>'].join('\n'));
  error.type = 'EUSAGE';
  errorHandler(error);
} else {
  validateFile(configFile, program.quiet);
}