'use strict';
const fs = require('fs');

exports.fileExists = filePath => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};
