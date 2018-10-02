'use strict';

const glob = require('glob');
const path = require('path');
const { promisify } = require('util');

const globAsync = promisify(glob);

/**
 * Load locally prepared layouts
 * @param {Object} args
 * @return {Promise<undefined>} resolves adding layouts
 */
function loadPluginLayouts({ boundActionCreators }) {
  const cwd = path.resolve(__dirname, '../src/layouts');

  // get all local layouts
  return globAsync('*.js', { cwd })
    .then(fileNames => fileNames.map(fileName => ({ component: path.resolve(cwd, fileName) })))
    .then(layoutConfigs => Promise.all(
      layoutConfigs.map(config => boundActionCreators.createLayout(config)),
    ));
}

module.exports = (...args) => {
  return Promise.resolve()
    .then(() => loadPluginLayouts(...args));
};
