'use strict';

const path = require('path');
const pluginConfigFactory = require('@brainhubeu/gatsby-docs-kit/plugins');
const _ = require('lodash');

console.log({ configEnv: process.env });
const url = process.env.CIRCLE_PULL_REQUEST;
const githubUrl = 'https://github.com/brainhubeu/react-carousel';
const postfix = url ? `★☂☀${_.last(url.split('/'))}♞♜♖` : 'local';

module.exports = {
  siteMetadata: {
    title: `React-carousel ${postfix}`,
    description: 'Feature-rich, react-way react component that does not suck',
    image: 'https://cdn-images-1.medium.com/max/1200/1*CLUFZFaXF6NG27NA3d_JkQ.jpeg',
    url: url || githubUrl,
    type: 'article',
    siteName: 'React-carousel',
    githubUrl: url || githubUrl,
  },

  // URL prefix on production environment. For more info see https://www.gatsbyjs.org/docs/path-prefix/
  pathPrefix: process.env.PATH_PREFIX || ' ',

  plugins: pluginConfigFactory({
    config: `${__dirname}/gatsby-docs-kit.yml`,
    resources: path.resolve(__dirname, '../docs'),
  }),
};
