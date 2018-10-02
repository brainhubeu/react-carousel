"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var parseToAst = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filePath, fileStr) {
    var ast, transpiled, _iterator, _isArray, _i, _ref2, item, tmp;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ast = void 0;

            // Preprocess and attempt to parse source; return an AST if we can, log an
            // error if we can't.

            _context.next = 3;
            return apiRunnerNode(`preprocessSource`, {
              filename: filePath,
              contents: fileStr
            });

          case 3:
            transpiled = _context.sent;

            if (!(transpiled && transpiled.length)) {
              _context.next = 32;
              break;
            }

            _iterator = transpiled, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

          case 6:
            if (!_isArray) {
              _context.next = 12;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("break", 29);

          case 9:
            _ref2 = _iterator[_i++];
            _context.next = 16;
            break;

          case 12:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("break", 29);

          case 15:
            _ref2 = _i.value;

          case 16:
            item = _ref2;
            _context.prev = 17;
            tmp = babylon.parse(item, {
              sourceType: `module`,
              plugins: [`*`]
            });

            ast = tmp;
            return _context.abrupt("break", 29);

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](17);

            report.error(_context.t0);
            return _context.abrupt("continue", 27);

          case 27:
            _context.next = 6;
            break;

          case 29:
            if (ast === undefined) {
              report.error(`Failed to parse preprocessed file ${filePath}`);
            }
            _context.next = 33;
            break;

          case 32:
            try {
              ast = babylon.parse(fileStr, {
                sourceType: `module`,
                sourceFilename: true,
                plugins: [`*`]
              });
            } catch (error) {
              report.error(`There was a problem parsing "${filePath}"; any GraphQL ` + `fragments or queries in this file were not processed. \n` + `This may indicate a syntax error in the code, or it may be a file type ` + `That Gatsby does not know how to parse.`);
            }

          case 33:
            return _context.abrupt("return", ast);

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[17, 23]]);
  }));

  return function parseToAst(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var findGraphQLTags = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(file, text) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              parseToAst(file, text).then(function (ast) {
                var queries = [];
                if (!ast) {
                  resolve(queries);
                  return;
                }

                (0, _babelTraverse2.default)(ast, {
                  ExportNamedDeclaration(path, state) {
                    path.traverse({
                      TaggedTemplateExpression(innerPath) {
                        var gqlAst = getGraphQLTag(innerPath);
                        if (gqlAst) {
                          gqlAst.definitions.forEach(function (def) {
                            if (!def.name || !def.name.value) {
                              report.panic(getMissingNameErrorMessage(file));
                            }
                          });

                          queries.push.apply(queries, gqlAst.definitions);
                        }
                      }
                    });
                  }
                });
                resolve(queries);
              }).catch(reject);
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function findGraphQLTags(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var _babelTraverse = require("babel-traverse");

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require(`fs-extra`);
var crypto = require(`crypto`);

// Traverse is a es6 module...

var babylon = require(`babylon`);

var report = require(`gatsby-cli/lib/reporter`);

var _require = require(`../../utils/babel-plugin-extract-graphql`),
    getGraphQLTag = _require.getGraphQLTag;

var apiRunnerNode = require(`../../utils/api-runner-node`);

var getMissingNameErrorMessage = function getMissingNameErrorMessage(file) {
  return report.stripIndent`
  GraphQL definitions must be "named".
  The query with the missing name is in ${file}.
  To fix the query, add "query MyQueryName" to the start of your query.
  So instead of:
    {
      allMarkdownRemark {
        totalCount
      }
    }

  Do:
    query MyQueryName {
      allMarkdownRemark {
        totalCount
      }
    }
`;
};


var cache = {};

var FileParser = function () {
  function FileParser() {
    (0, _classCallCheck3.default)(this, FileParser);
  }

  FileParser.prototype.parseFile = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(file) {
      var text, hash, astDefinitions;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              text = void 0;
              _context3.prev = 1;
              _context3.next = 4;
              return fs.readFile(file, `utf8`);

            case 4:
              text = _context3.sent;
              _context3.next = 11;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](1);

              report.error(`There was a problem reading the file: ${file}`, _context3.t0);
              return _context3.abrupt("return", null);

            case 11:
              if (!(text.indexOf(`graphql`) === -1)) {
                _context3.next = 13;
                break;
              }

              return _context3.abrupt("return", null);

            case 13:
              hash = crypto.createHash(`md5`).update(file).update(text).digest(`hex`);
              _context3.prev = 14;
              _context3.t1 = cache[hash];

              if (_context3.t1) {
                _context3.next = 20;
                break;
              }

              _context3.next = 19;
              return findGraphQLTags(file, text);

            case 19:
              _context3.t1 = cache[hash] = _context3.sent;

            case 20:
              astDefinitions = _context3.t1;
              return _context3.abrupt("return", astDefinitions.length ? {
                kind: `Document`,
                definitions: astDefinitions
              } : null);

            case 24:
              _context3.prev = 24;
              _context3.t2 = _context3["catch"](14);

              report.error(`There was a problem parsing the GraphQL query in file: ${file}`, _context3.t2);
              return _context3.abrupt("return", null);

            case 28:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[1, 7], [14, 24]]);
    }));

    function parseFile(_x5) {
      return _ref4.apply(this, arguments);
    }

    return parseFile;
  }();

  FileParser.prototype.parseFiles = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(files) {
      var _this = this;

      var documents;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              documents = new Map();
              return _context4.abrupt("return", Promise.all(files.map(function (file) {
                return _this.parseFile(file).then(function (doc) {
                  if (!doc) return;
                  documents.set(file, doc);
                });
              })).then(function () {
                return documents;
              }));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function parseFiles(_x6) {
      return _ref5.apply(this, arguments);
    }

    return parseFiles;
  }();

  return FileParser;
}();

exports.default = FileParser;
//# sourceMappingURL=file-parser.js.map