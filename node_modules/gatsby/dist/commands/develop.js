"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var startServer = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(program) {
    var _this = this;

    var directory, directoryPath, createIndexHtml, compilerConfig, devConfig, compiler, app, developMiddleware, proxy, prefix, _url, server, io, listener, watchGlobs;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            directory = program.directory;
            directoryPath = withBasePath(directory);

            createIndexHtml = function createIndexHtml() {
              return developHtml(program).catch(function (err) {
                if (err.name !== `WebpackError`) {
                  report.panic(err);
                  return;
                }
                report.panic(report.stripIndent`
          There was an error compiling the html.js component for the development server.

          See our docs page on debugging HTML builds for help https://goo.gl/yL9lND
        `, err);
              });
            };

            // Start bootstrap process.


            _context2.next = 5;
            return bootstrap(program);

          case 5:
            _context2.next = 7;
            return createIndexHtml();

          case 7:
            _context2.next = 9;
            return webpackConfig(program, directory, `develop`, program.port);

          case 9:
            compilerConfig = _context2.sent;
            devConfig = compilerConfig.resolve();
            compiler = webpack(devConfig);

            /**
             * Set up the express app.
             **/

            app = express();

            app.use(require(`webpack-hot-middleware`)(compiler, {
              log: function log() {},
              path: `/__webpack_hmr`,
              heartbeat: 10 * 1000
            }));
            app.use(`/___graphql`, graphqlHTTP({
              schema: store.getState().schema,
              graphiql: true
            }));

            // Allow requests from any origin. Avoids CORS issues when using the `--host` flag.
            app.use(function (req, res, next) {
              res.header(`Access-Control-Allow-Origin`, `*`);
              res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
              next();
            });

            /**
             * Refresh external data sources.
             * This behavior is disabled by default, but the ENABLE_REFRESH_ENDPOINT env var enables it
             * If no GATSBY_REFRESH_TOKEN env var is available, then no Authorization header is required
             **/
            app.post(`/__refresh`, function (req, res) {
              var enableRefresh = process.env.ENABLE_GATSBY_REFRESH_ENDPOINT;
              var refreshToken = process.env.GATSBY_REFRESH_TOKEN;
              var authorizedRefresh = !refreshToken || req.headers.authorization === refreshToken;

              if (enableRefresh && authorizedRefresh) {
                console.log(`Refreshing source data`);
                sourceNodes();
              }
              res.end();
            });

            app.get(`/__open-stack-frame-in-editor`, function (req, res) {
              launchEditor(req.query.fileName, req.query.lineNumber);
              res.end();
            });

            app.use(express.static(__dirname + `/public`));

            app.use(require(`webpack-dev-middleware`)(compiler, {
              noInfo: true,
              quiet: true,
              publicPath: devConfig.output.publicPath
            }));

            // Expose access to app for advanced use cases
            developMiddleware = store.getState().config.developMiddleware;


            if (developMiddleware) {
              developMiddleware(app);
            }

            // Set up API proxy.
            proxy = store.getState().config.proxy;

            if (proxy) {
              prefix = proxy.prefix, _url = proxy.url;

              app.use(`${prefix}/*`, function (req, res) {
                var proxiedUrl = _url + req.originalUrl;
                req.pipe(request(proxiedUrl)).pipe(res);
              });
            }

            // Check if the file exists in the public folder.
            app.get(`*`, function (req, res, next) {
              // Load file but ignore errors.
              res.sendFile(directoryPath(`/public${decodeURIComponent(req.path)}`), function (err) {
                // No err so a file was sent successfully.
                if (!err || !err.path) {
                  next();
                } else if (err) {
                  // There was an error. Let's check if the error was because it
                  // couldn't find an HTML file. We ignore these as we want to serve
                  // all HTML from our single empty SSR html file.
                  var parsedPath = parsePath(err.path);
                  if (parsedPath.extname === `` || parsedPath.extname.startsWith(`.html`)) {
                    next();
                  } else {
                    res.status(404).end();
                  }
                }
              });
            });

            // Render an HTML page and serve it.
            app.use(function (req, res, next) {
              var parsedPath = parsePath(req.path);
              if (parsedPath.extname === `` || parsedPath.extname.startsWith(`.html`) || parsedPath.path.endsWith(`/`)) {
                res.sendFile(directoryPath(`public/index.html`), function (err) {
                  if (err) {
                    res.status(500).end();
                  }
                });
              } else {
                next();
              }
            });

            /**
             * Set up the HTTP server and socket.io.
             **/

            server = require(`http`).Server(app);

            // If a SSL cert exists in program, use it with `createServer`.

            if (program.ssl) {
              server = require(`https`).createServer(program.ssl, app);
            }

            io = require(`socket.io`)(server);


            io.on(`connection`, function (socket) {
              socket.join(`clients`);
            });

            listener = server.listen(program.port, program.host, function (err) {
              if (err) {
                if (err.code === `EADDRINUSE`) {
                  // eslint-disable-next-line max-len
                  report.panic(`Unable to start Gatsby on port ${program.port} as there's already a process listing on that port.`);
                  return;
                }

                report.panic(`There was a problem starting the development server`, err);
              }
            });

            // Register watcher that rebuilds index.html every time html.js changes.

            watchGlobs = [`src/html.js`, `plugins/**/gatsby-ssr.js`].map(function (path) {
              return directoryPath(path);
            });


            chokidar.watch(watchGlobs).on(`change`, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return createIndexHtml();

                    case 2:
                      io.to(`clients`).emit(`reload`);

                    case 3:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            })));

            return _context2.abrupt("return", [compiler, listener]);

          case 34:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function startServer(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = require(`url`);
var chokidar = require(`chokidar`);
var express = require(`express`);
var graphqlHTTP = require(`express-graphql`);
var parsePath = require(`parse-filepath`);
var request = require(`request`);
var rl = require(`readline`);
var webpack = require(`webpack`);
var webpackConfig = require(`../utils/webpack.config`);
var bootstrap = require(`../bootstrap`);

var _require = require(`../redux`),
    store = _require.store;

var copyStaticDirectory = require(`../utils/copy-static-directory`);
var developHtml = require(`./develop-html`);

var _require2 = require(`../utils/path`),
    withBasePath = _require2.withBasePath;

var report = require(`gatsby-cli/lib/reporter`);
var launchEditor = require(`react-dev-utils/launchEditor`);
var formatWebpackMessages = require(`react-dev-utils/formatWebpackMessages`);
var chalk = require(`chalk`);
var address = require(`address`);
var sourceNodes = require(`../utils/source-nodes`);
var getSslCert = require(`../utils/get-ssl-cert`);

// const isInteractive = process.stdout.isTTY

// Watch the static directory and copy files to public as they're added or
// changed. Wait 10 seconds so copying doesn't interfer with the regular
// bootstrap.
setTimeout(function () {
  copyStaticDirectory();
}, 10000);

var rlInterface = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Quit immediately on hearing ctrl-c
rlInterface.on(`SIGINT`, function () {
  process.exit();
});

module.exports = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(program) {
    var detect, port, compiler, prepareUrls, printInstructions, isFirstCompile;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            printInstructions = function printInstructions(appName, urls, useYarn) {
              console.log();
              console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
              console.log();

              if (urls.lanUrlForTerminal) {
                console.log(`  ${chalk.bold(`Local:`)}            ${urls.localUrlForTerminal}`);
                console.log(`  ${chalk.bold(`On Your Network:`)}  ${urls.lanUrlForTerminal}`);
              } else {
                console.log(`  ${urls.localUrlForTerminal}`);
              }

              console.log();
              console.log(`View GraphiQL, an in-browser IDE, to explore your site's data and schema`);
              console.log();
              console.log(`  ${urls.localUrlForTerminal}___graphql`);

              console.log();
              console.log(`Note that the development build is not optimized.`);
              console.log(`To create a production build, use ` + `${chalk.cyan(`gatsby build`)}`);
              console.log();
            };

            prepareUrls = function prepareUrls(protocol, host, port) {
              var formatUrl = function formatUrl(hostname) {
                return url.format({
                  protocol,
                  hostname,
                  port,
                  pathname: `/`
                });
              };
              var prettyPrintUrl = function prettyPrintUrl(hostname) {
                return url.format({
                  protocol,
                  hostname,
                  port: chalk.bold(port),
                  pathname: `/`
                });
              };

              var isUnspecifiedHost = host === `0.0.0.0` || host === `::`;
              var lanUrlForConfig = void 0,
                  lanUrlForTerminal = void 0;
              if (isUnspecifiedHost) {
                try {
                  // This can only return an IPv4 address
                  lanUrlForConfig = address.ip();
                  if (lanUrlForConfig) {
                    // Check if the address is a private ip
                    // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
                    if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
                      // Address is private, format it for later use
                      lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
                    } else {
                      // Address is not private, so we will discard it
                      lanUrlForConfig = undefined;
                    }
                  }
                } catch (_e) {
                  // ignored
                }
              }
              // TODO collect errors (GraphQL + Webpack) in Redux so we
              // can clear terminal and print them out on every compile.
              // Borrow pretty printing code from webpack plugin.
              var localUrlForTerminal = prettyPrintUrl(host);
              var localUrlForBrowser = formatUrl(host);
              return {
                lanUrlForConfig,
                lanUrlForTerminal,
                localUrlForTerminal,
                localUrlForBrowser
              };
            };

            detect = require(`detect-port`);
            port = typeof program.port === `string` ? parseInt(program.port, 10) : program.port;

            // In order to enable custom ssl, --cert-file --key-file and -https flags must all be
            // used together

            if ((program[`cert-file`] || program[`key-file`]) && !program.https) {
              report.panic(`for custom ssl --https, --cert-file, and --key-file must be used together`);
            }

            // Check if https is enabled, then create or get SSL cert.
            // Certs are named after `name` inside the project's package.json.

            if (!program.https) {
              _context3.next = 9;
              break;
            }

            _context3.next = 8;
            return getSslCert({
              name: program.sitePackageJson.name,
              certFile: program[`cert-file`],
              keyFile: program[`key-file`],
              directory: program.directory
            });

          case 8:
            program.ssl = _context3.sent;

          case 9:
            compiler = void 0;
            _context3.next = 12;
            return new Promise(function (resolve) {
              detect(port, function (err, _port) {
                if (err) {
                  report.panic(err);
                }

                if (port !== _port) {
                  // eslint-disable-next-line max-len
                  var question = `Something is already running at port ${port} \nWould you like to run the app at another port instead? [Y/n] `;

                  rlInterface.question(question, function (answer) {
                    if (answer.length === 0 || answer.match(/^yes|y$/i)) {
                      program.port = _port; // eslint-disable-line no-param-reassign
                    }

                    startServer(program).then(function (_ref4) {
                      var c = _ref4[0],
                          l = _ref4[1];

                      compiler = c;
                      resolve();
                    });
                  });
                } else {
                  startServer(program).then(function (_ref5) {
                    var c = _ref5[0],
                        l = _ref5[1];

                    compiler = c;
                    resolve();
                  });
                }
              });
            });

          case 12:
            isFirstCompile = true;
            // "done" event fires when Webpack has finished recompiling the bundle.
            // Whether or not you have warnings or errors, you will get this event.

            compiler.plugin(`done`, function (stats) {
              // We have switched off the default Webpack output in WebpackDevServer
              // options so we are going to "massage" the warnings and errors and present
              // them in a readable focused way.
              var messages = formatWebpackMessages(stats.toJson({}, true));
              var urls = prepareUrls(program.ssl ? `https` : `http`, program.host, program.port);
              var isSuccessful = !messages.errors.length;
              // if (isSuccessful) {
              // console.log(chalk.green(`Compiled successfully!`))
              // }
              // if (isSuccessful && (isInteractive || isFirstCompile)) {
              if (isSuccessful && isFirstCompile) {
                printInstructions(program.sitePackageJson.name, urls, program.useYarn);
                if (program.open) {
                  require(`opn`)(urls.localUrlForBrowser);
                }
              }

              isFirstCompile = false;

              // If errors exist, only show errors.
              // if (messages.errors.length) {
              // // Only keep the first error. Others are often indicative
              // // of the same problem, but confuse the reader with noise.
              // if (messages.errors.length > 1) {
              // messages.errors.length = 1
              // }
              // console.log(chalk.red("Failed to compile.\n"))
              // console.log(messages.errors.join("\n\n"))
              // return
              // }

              // Show warnings if no errors were found.
              // if (messages.warnings.length) {
              // console.log(chalk.yellow("Compiled with warnings.\n"))
              // console.log(messages.warnings.join("\n\n"))

              // // Teach some ESLint tricks.
              // console.log(
              // "\nSearch for the " +
              // chalk.underline(chalk.yellow("keywords")) +
              // " to learn more about each warning."
              // )
              // console.log(
              // "To ignore, add " +
              // chalk.cyan("// eslint-disable-next-line") +
              // " to the line before.\n"
              // )
              // }
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}();
//# sourceMappingURL=develop.js.map