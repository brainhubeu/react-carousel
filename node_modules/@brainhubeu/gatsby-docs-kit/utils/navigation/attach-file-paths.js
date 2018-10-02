'use strict';
const _ = require('lodash');
const path = require('path');

/**
 * Generate relative path to file
 * @param {String} fileName
 * @param {String} dir
 * @return {String} relative path to file
 */
function getRelativePath(fileName, dir = '.') {
  if (!fileName) {
    return null;
  }
  return path.join(dir, fileName);
}

/**
 * Generate absolute path to file
 * @param {String} fileName
 * @param {String} dir
 * @param {String} mainDirAbsolutePath
 * @return {String} relative path to file
 */
function getAbsolutePath(fileName, dir = '.', mainDirAbsolutePath) {
  if (!fileName) {
    return null;
  }

  return path.resolve(mainDirAbsolutePath, dir, fileName);
}


/**
 * Generate sidemenu items with relativePaths to markdown files
 * @param {Array} menu
 * @param {String} menu[].file
 * @param {Array} menu[].items
 * @param {String} dir
 * @param {String} mainDirAbsolutePath
 * @return {Object} extended sidemenu
 */
function getSidemenuWithRelativePaths(menu = [], dir, mainDirAbsolutePath) {
  if (!menu || !_.isArray(menu)) {
    return menu;
  }

  return menu
    .map(menuItem => {
      const relativeDirPath = path.join(dir || '', menuItem.dir || '');
      return {
        ...menuItem,
        relativePath: getRelativePath(menuItem.file, relativeDirPath),
        absolutePath: getAbsolutePath(menuItem.file, relativeDirPath, mainDirAbsolutePath),
        items: getSidemenuWithRelativePaths(menuItem.items, relativeDirPath, mainDirAbsolutePath),
      };
    });
}


/**
 * Generate relativePath to Md for menu node
 * @param {Menu[]} navNode
 * @param {String} mainDirAbsolutePath absolute path to config directory
 * @return {Object} extended menu node
 */
function attachMarkdownFilePath(navNode = [], mainDirAbsolutePath) {
  return navNode
    .map((page = {}) => ({
      ...page,
      relativePath: getRelativePath(page.file, page.dir),
      absolutePath: getAbsolutePath(page.file, page.dir, mainDirAbsolutePath),
      sidemenu: getSidemenuWithRelativePaths(page.sidemenu, page.dir, mainDirAbsolutePath),
    }));
}

exports.attachMarkdownFilePath = attachMarkdownFilePath;

