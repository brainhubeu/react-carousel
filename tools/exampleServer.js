const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.example');

const bundler = webpack(config);

browserSync({
  port: 3000,
  ui: {
    port: 3001,
  },
  ghostMode: false,
  server: {
    baseDir: 'example',

    middleware: [
      (req, res, next) => {
        if (!req.url.match(/^\/env\.js/)) {
          next();
        } else {
          res.setHeader('content-type', 'text/javascript');
          res.end(`window.env = ${JSON.stringify({
            ENVIRONMENT: process.env.ENVIRONMENT,
            API_HOST: process.env.API_HOST,
          })};`);
        }
      },
      historyApiFallback(),

      webpackDevMiddleware(bundler, {
        publicPath: config.output.publicPath,
        noInfo: true,
        quiet: false,
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false,
        },
      }),
      webpackHotMiddleware(bundler),
    ],
  },
  files: [
    'example/*.html',
  ],
});
