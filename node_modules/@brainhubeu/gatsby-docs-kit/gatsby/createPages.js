'use strict';

const _ = require('lodash');
const { getTemplatePath } = require('../utils/templates');
const { isJavascriptFile } = require('../utils/mime');
const getMenu = require('./grapql/getMenu');

const DEFAULT_LAYOUT_ID = 'default';
const MAIN_URL = '/';

/**
 * Create redirection for '/' - if user hasn't specified main page, then 
 * @param {GatsbyActions} boundActionCreators
 * @param {String[]} createdUrls
 * @return {String[]} array containing URL's of all created pages and redirection
 */
function createMainPageRedirection(boundActionCreators, createdUrls = []) {
  const hasMainPage = !!createdUrls.find(uri => uri === MAIN_URL);
  const firstPage = createdUrls[0];

  if (hasMainPage || !firstPage) {
    return;
  }

  boundActionCreators.createRedirect({
    fromPath: MAIN_URL,
    toPath: firstPage,
    isPermanent: true,
    redirectInBrowser: true,
  });
}

/**
 * Create Gatsby page
 * @param {GatsbyActions} boundActionCreators
 * @param {Object} menuItem
 * @param {String} menuItem.url
 * @param {String} menuItem.relativePath relative path to markdown
 * @param {Object} view
 * @param {String} view.template
 * @param {String} view.layout
 * @return {String} url of created page
 */
function createGatsbyPage(boundActionCreators, menuItem, view = {}) {
  const { createPage } = boundActionCreators;

  // if there is no relativePath, then we assume that there is no markdown and no page to create
  // if there is no url then we cannot create new page
  if (!menuItem.relativePath || !menuItem.url) {
    return;
  }

  // if user specified javascript file in config, then treat it as page to render
  const component = isJavascriptFile(menuItem.absolutePath)
    ? menuItem.absolutePath
    : view.template;

  createPage({
    path: menuItem.url,
    component,
    layout: view.layout,
    context: {
      relativePath: `GDK>${menuItem.relativePath}`,
    },
  });

  return menuItem.url;
}


/**
 * Create Gastby pages from list
 * @param {GatsbyActions} boundActionCreators
 * @param {Array} menuItems
 * @param {Object} inheritedView
 * @param {String} inheritedView.template
 * @param {String} inheritedView.layout
 * @return {String} url of created page
 */
function createGatsbyPagesFromList(boundActionCreators, menuItems = [], inheritedView = {}) {
  if (!menuItems || !Array.isArray(menuItems)) {
    return [];
  }

  /**
   * Contains array of array with created urls
   * @type {Array<Array<String>}
   */
  const createdUrls = menuItems
    .map(menuItem => {
      const view = {
        template: menuItem.template ? getTemplatePath(menuItem.template) : (inheritedView.template || getTemplatePath()),
        layout: menuItem.layout || inheritedView.layout || DEFAULT_LAYOUT_ID,
      };

      // create page and get url of created page
      const pageUrl = createGatsbyPage(boundActionCreators, menuItem, view);

      // create pages for sub menu items and get url of created pages
      const createdUrls = createGatsbyPagesFromList(boundActionCreators, menuItem.sidemenu || menuItem.items, view);

      return [pageUrl, ...createdUrls];
    });

  return _.flattenDeep(createdUrls);
}


module.exports = ({ boundActionCreators, graphql }) => {
  return getMenu(graphql)
    .then(menu => createGatsbyPagesFromList(boundActionCreators, menu))
    .then((uris = []) => createMainPageRedirection(boundActionCreators, uris.filter(u => u)));
};
