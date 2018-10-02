const { fileExists } = require('../../utils/fs');

/**
 * Add imports to source code
 * @param {String} source source code
 * @param {String} importPath path to import
 * @return {String} extended source code
 */
function compile(source, importPath) {
  return `import * as GlobalScope from '${importPath}';
          export const Scope = GlobalScope;
          ${source}`;
}

/**
 * Get import path from webpack loader query
 * @param {String} querystring
 * @return {String} import path
 */
function getImportPath(querystring) {
  if (!querystring || typeof querystring !== 'string' || querystring.charAt(0) !== '?') {
    return;
  }

  try {
    const parsedQueryString = JSON.parse(querystring.substr(1));
    return parsedQueryString.importPath;
  } catch (e) {
    return;
  }
}

/**
 * Webpack loader to import user defined scope
 * @param {String} source source code
 * @return {String} import path
 */
module.exports = function(source) {
  const importPath = getImportPath(this.query);

  if (!importPath || !fileExists(importPath)) {
    return source;
  }

  return compile(source, importPath);
}
