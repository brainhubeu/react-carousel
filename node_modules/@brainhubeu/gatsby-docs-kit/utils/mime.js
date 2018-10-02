const path = require('path');

function isJavascriptFile(filePath) {
  if (!filePath) {
    return false;
  }
  const fileExtension = path.parse(filePath).ext;

  return fileExtension === '.js' || fileExtension === '.jsx';
}

module.exports.isJavascriptFile = isJavascriptFile;
