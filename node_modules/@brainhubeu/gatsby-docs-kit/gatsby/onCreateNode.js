'use strict';

const path = require('path');

module.exports = ({ node, boundActionCreators, getNode }, pluginOptions) => {
  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }

  const { createNodeField } = boundActionCreators;
  const markdownAbsolutePath = getNode(node.parent).absolutePath;
  // absolute path to directory containing gatsby-docs-config
  const docsKitDirAbsolutePath = path.parse(pluginOptions.config).dir;

  createNodeField({
    node,
    name: 'relativePath',
    value: `GDK>${path.relative(docsKitDirAbsolutePath, markdownAbsolutePath)}`,
  });
};
