/**
 * Plugins setup factory
 */

function pluginConfigFactory(config) {
  if (!config) {
    throw new Error('Gatsby Docs Kit: No config specified. See your gatsby-config.js file.')
  }

  if (!config.config) {
    throw new Error('Gatsby Docs Kit: no `config` file path specified. See your gatsby-config.js file.')
  }

  if (!config.resources) {
    throw new Error('Gatsby Docs Kit: no `resources` pattern specified. See your gatsby-config.js file.')
  }

  // TODO add comments here
  return [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss-sass',
    'gatsby-plugin-sharp',
    `gatsby-plugin-meta-redirect`,
    `gatsby-plugin-react-next`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: config.resources,
        name: 'content-pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: '@brainhubeu/gatsby-docs-kit',
            options: {
              config: config.config,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 600,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
          },
        ],
      },
    },
    'gatsby-plugin-catch-links',
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: './src/static/favicon.png',
        injectHTML: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false,
        },
      },
    },
  ];
}

module.exports = pluginConfigFactory
