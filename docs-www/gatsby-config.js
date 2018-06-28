'use strict';

const path = require('path');
const pluginConfigFactory = require('@brainhubeu/gatsby-docs-kit/plugins');

module.exports = {
  siteMetadata: {
    title: 'Brainhub template',
    description: 'Default template for open-source libraries',
    image: 'https://cdn-images-1.medium.com/max/1200/1*CLUFZFaXF6NG27NA3d_JkQ.jpeg',
    url: 'https://screencloud.dev.brainhub.pl/',
    type: 'article',
    siteName: 'Brainhub template',
    githubUrl: 'https://github.com/brainhubeu',
  },

  // URL prefix on production environment. For more info see https://www.gatsbyjs.org/docs/path-prefix/
  pathPrefix: process.env.PATH_PREFIX || ' ',

  plugins: pluginConfigFactory({
    config: `${__dirname}/gatsby-docs-kit.yml`,
    resources: path.resolve(__dirname, '../docs'),
  }),
};
