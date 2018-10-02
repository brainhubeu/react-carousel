'use strict';

/**
 * Extending gatsby-transformer-remark
 */

const visit = require('unist-util-visit');
const _ = require('lodash');
const path = require('path');

const isString = value => typeof value === 'string';

/**
 * Get url from menu
 * @param {Array} pages
 * @param {String} absolutePath
 * @return {String} ..
 */
function findPageUrlByMarkdownAbsoluteFilePath(pages = [], absolutePath) {
  return _.chain(pages)
    .map(page =>
      (page.absolutePath && page.absolutePath === absolutePath && page.url)
      || findPageUrlByMarkdownAbsoluteFilePath(page.sidemenu || page.items, absolutePath)
    )
    .flattenDeep()
    .find(x => !!x)
    .value();
}

/**
 * Normalize 'code' node to allow rendering and live editing React components
 * @param {Object} node
 */
function normalizeCodeNode(node) {
  if (!isString(node.lang) || !node.lang.startsWith('jsx') || !node.lang.includes('render')) {
    return;
  }
  node.type = 'html';

  node.value = `
  <div>
    <div class="gatsby-render-code" ></div>
    <div class="gatsby-render-source-code" style="display:none;">
    ${_.escape(node.value)}
    </div>
  </div>`;
}

/**
 * Replace local markdown links with gatsby links
 * @param {Object} node
 * @param {Object} markdownNode
 * @param {Array} files
 * @param {Function} getNode
 */
function normalizeLinkNode(node, markdownNode, files, getNode) {
  if (!node.url) {
    return;
  }
  // absolute path to directory containg markdown file
  const markdownFileDirPath = path.parse(markdownNode.fileAbsolutePath).dir;

  // absolute path to file, which link point to
  const targetFileAbsolutePath = path.resolve(markdownFileDirPath, node.url);

  // determine if tareget file exists
  const targetFileExists = !!files.find(file => file && file.absolutePath === targetFileAbsolutePath);

  // get menu node
  const menuNode = getNode('Menu Config >> Gatsby Docs Kit'); // TODO move it magic string to constant

  if (!menuNode || !targetFileExists) {
    return;
  }

  // get url of targeted markdown file
  const pageUrl = findPageUrlByMarkdownAbsoluteFilePath(menuNode.pages, targetFileAbsolutePath);

  if (!pageUrl) {
    return;
  }

  node.url = pageUrl;
}


module.exports = ({ markdownAST, markdownNode, files, getNode }) => {
  visit(markdownAST, `code`, normalizeCodeNode);
  visit(markdownAST, `link`, node => normalizeLinkNode(node, markdownNode, files, getNode));
};
