'use strict';
const path = require('path')
const _ = require('lodash')

const GLOBALS_FILE_PATH = 'src/globalReferences.js';

const SCOPE_LOADER_FILE_PATH = 'webpack-loaders/scope-loader.js';

/**
 * Add custom webpack loader to magically import user defined global references to local globalReferences file
 * @param {Object} options
 * @param {Config} options.config
 * @param {Object} options.program
 * @param {String} options.program.directory
 */
module.exports = ({ program, config }) => {
  /**
   * Extending webpack config to run babel on gatsby-docs-kit files
   */

  // get current babel loader
  const babelLoader = config.resolve().module.loaders.find(loaderConfig => loaderConfig.loader === 'babel');
  // path to directory that will need to babeled
  const localSrcDirPath = path.resolve(path.join(__dirname, '../src'));

  // new loader config
  const gatsbyDocsKitBabelLoader = {
    ...babelLoader,
    test: new RegExp(`${_.escapeRegExp('/gatsby-docs-kit/src/')}.*jsx?$`),
    exclude: undefined,
  };

  // add new loader
  config.loader('babel', gatsbyDocsKitBabelLoader);

  /**
   * Modifying local globalReferences.js to import user defined globalReferences.js
   */
  // path to plugin globalReferences file
  const localGlobalsFilePath = path.resolve(path.join(__dirname, '..', GLOBALS_FILE_PATH));
  // path to user defined globalReferences
  const mainGlobalsFilePath = path.resolve(program.directory, GLOBALS_FILE_PATH);

  // add webpack loader
  config.loader(
    path.resolve(__dirname, SCOPE_LOADER_FILE_PATH),
    {
      test: localGlobalsFilePath,
      query: {
        importPath: mainGlobalsFilePath,
      },
    },
  );
};


