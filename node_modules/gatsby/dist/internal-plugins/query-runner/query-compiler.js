"use strict";

exports.__esModule = true;
exports.Runner = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _graphql = require("graphql");

var _relayCompiler = require("relay-compiler");

var _RelayParser = require("relay-compiler/lib/RelayParser");

var _RelayParser2 = _interopRequireDefault(_RelayParser);

var _ASTConvert = require("relay-compiler/lib/ASTConvert");

var _ASTConvert2 = _interopRequireDefault(_ASTConvert);

var _GraphQLCompilerContext = require("relay-compiler/lib/GraphQLCompilerContext");

var _GraphQLCompilerContext2 = _interopRequireDefault(_GraphQLCompilerContext);

var _filterContextForNode = require("relay-compiler/lib/filterContextForNode");

var _filterContextForNode2 = _interopRequireDefault(_filterContextForNode);

var _redux = require("../../redux");

var _fileParser = require("./file-parser");

var _fileParser2 = _interopRequireDefault(_fileParser);

var _GraphQLIRPrinter = require("relay-compiler/lib/GraphQLIRPrinter");

var _GraphQLIRPrinter2 = _interopRequireDefault(_GraphQLIRPrinter);

var _graphqlErrors = require("./graphql-errors");

var _reporter = require("gatsby-cli/lib/reporter");

var _reporter2 = _interopRequireDefault(_reporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalize = require(`normalize-path`);

var _ = require(`lodash`);

var printTransforms = _relayCompiler.IRTransforms.printTransforms;

var _require = require(`graphql`),
    ArgumentsOfCorrectTypeRule = _require.ArgumentsOfCorrectTypeRule,
    DefaultValuesOfCorrectTypeRule = _require.DefaultValuesOfCorrectTypeRule,
    FragmentsOnCompositeTypesRule = _require.FragmentsOnCompositeTypesRule,
    KnownTypeNamesRule = _require.KnownTypeNamesRule,
    LoneAnonymousOperationRule = _require.LoneAnonymousOperationRule,
    PossibleFragmentSpreadsRule = _require.PossibleFragmentSpreadsRule,
    ScalarLeafsRule = _require.ScalarLeafsRule,
    VariablesAreInputTypesRule = _require.VariablesAreInputTypesRule,
    VariablesInAllowedPositionRule = _require.VariablesInAllowedPositionRule;

var validationRules = [ArgumentsOfCorrectTypeRule, DefaultValuesOfCorrectTypeRule, FragmentsOnCompositeTypesRule, KnownTypeNamesRule, LoneAnonymousOperationRule, PossibleFragmentSpreadsRule, ScalarLeafsRule, VariablesAreInputTypesRule, VariablesInAllowedPositionRule];

var Runner = function () {
  function Runner(baseDir, fragmentsDir, schema) {
    (0, _classCallCheck3.default)(this, Runner);

    this.baseDir = baseDir;
    this.fragmentsDir = fragmentsDir;
    this.schema = schema;
  }

  Runner.prototype.reportError = function reportError(message) {
    if (process.env.NODE_ENV === `production`) {
      _reporter2.default.panic(`${_reporter2.default.format.red(`GraphQL Error`)} ${message}`);
    } else {
      _reporter2.default.log(`${_reporter2.default.format.red(`GraphQL Error`)} ${message}`);
    }
  };

  Runner.prototype.compileAll = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var nodes;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.parseEverything();

            case 2:
              nodes = _context.sent;
              _context.next = 5;
              return this.write(nodes);

            case 5:
              return _context.abrupt("return", _context.sent);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function compileAll() {
      return _ref.apply(this, arguments);
    }

    return compileAll;
  }();

  Runner.prototype.parseEverything = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var files, parser;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // FIXME: this should all use gatsby's configuration to determine parsable
              // files (and how to parse them)
              files = _glob2.default.sync(`${this.fragmentsDir}/**/*.+(t|j)s?(x)`, {
                nodir: true
              });

              files = files.concat(_glob2.default.sync(`${this.baseDir}/**/*.+(t|j)s?(x)`, { nodir: true }));
              files = files.filter(function (d) {
                return !d.match(/\.d\.ts$/);
              });
              files = files.map(normalize);

              // Ensure all page components added as they're not necessarily in the
              // pages directory e.g. a plugin could add a page component.  Plugins
              // *should* copy their components (if they add a query) to .cache so that
              // our babel plugin to remove the query on building is active (we don't
              // run babel on code in node_modules). Otherwise the component will throw
              // an error in the browser of "graphql is not defined".
              files = files.concat(Object.keys(_redux.store.getState().components).map(function (c) {
                return normalize(c);
              }));
              files = _.uniq(files);

              parser = new _fileParser2.default();
              _context2.next = 9;
              return parser.parseFiles(files);

            case 9:
              return _context2.abrupt("return", _context2.sent);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function parseEverything() {
      return _ref2.apply(this, arguments);
    }

    return parseEverything;
  }();

  Runner.prototype.write = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(nodes) {
      var _this = this;

      var compiledNodes, namePathMap, nameDefMap, documents, _loop, _iterator, _isArray, _i, _ref5, _ref4, filePath, doc, _ret, compilerContext, printContext;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              compiledNodes = new Map();
              namePathMap = new Map();
              nameDefMap = new Map();
              documents = [];

              _loop = function _loop(filePath, doc) {
                var errors = (0, _graphql.validate)(_this.schema, doc, validationRules);

                if (errors && errors.length) {
                  _this.reportError((0, _graphqlErrors.graphqlValidationError)(errors, filePath));
                  return {
                    v: compiledNodes
                  };
                }

                documents.push(doc);
                doc.definitions.forEach(function (def) {
                  var name = def.name.value;
                  namePathMap.set(name, filePath);
                  nameDefMap.set(name, def);
                });
              };

              _iterator = nodes.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

            case 6:
              if (!_isArray) {
                _context3.next = 12;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("break", 24);

            case 9:
              _ref5 = _iterator[_i++];
              _context3.next = 16;
              break;

            case 12:
              _i = _iterator.next();

              if (!_i.done) {
                _context3.next = 15;
                break;
              }

              return _context3.abrupt("break", 24);

            case 15:
              _ref5 = _i.value;

            case 16:
              _ref4 = _ref5;
              filePath = _ref4[0];
              doc = _ref4[1];
              _ret = _loop(filePath, doc);

              if (!(typeof _ret === "object")) {
                _context3.next = 22;
                break;
              }

              return _context3.abrupt("return", _ret.v);

            case 22:
              _context3.next = 6;
              break;

            case 24:
              compilerContext = new _GraphQLCompilerContext2.default(this.schema);
              _context3.prev = 25;

              compilerContext = compilerContext.addAll(_ASTConvert2.default.convertASTDocuments(this.schema, documents, validationRules, _RelayParser2.default.transform.bind(_RelayParser2.default)));
              _context3.next = 33;
              break;

            case 29:
              _context3.prev = 29;
              _context3.t0 = _context3["catch"](25);

              this.reportError((0, _graphqlErrors.graphqlError)(namePathMap, nameDefMap, _context3.t0));
              return _context3.abrupt("return", compiledNodes);

            case 33:
              printContext = printTransforms.reduce(function (ctx, transform) {
                return transform(ctx, _this.schema);
              }, compilerContext);


              compilerContext.documents().forEach(function (node) {
                if (node.kind !== `Root`) return;

                var name = node.name;

                var filePath = namePathMap.get(name) || ``;

                if (compiledNodes.has(filePath)) {
                  var otherNode = compiledNodes.get(filePath);
                  _this.reportError((0, _graphqlErrors.multipleRootQueriesError)(filePath, nameDefMap.get(name), otherNode && nameDefMap.get(otherNode.name)));
                  return;
                }

                var text = (0, _filterContextForNode2.default)(printContext.getRoot(name), printContext).documents().map(_GraphQLIRPrinter2.default.print).join(`\n`);

                compiledNodes.set(filePath, {
                  name,
                  text,
                  path: _path2.default.join(_this.baseDir, filePath)
                });
              });

              return _context3.abrupt("return", compiledNodes);

            case 36:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[25, 29]]);
    }));

    function write(_x) {
      return _ref3.apply(this, arguments);
    }

    return write;
  }();

  return Runner;
}();

exports.Runner = Runner;

exports.default = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var _store$getState, program, schema, runner, queries;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _store$getState = _redux.store.getState(), program = _store$getState.program, schema = _store$getState.schema;
            runner = new Runner(`${program.directory}/src`, `${program.directory}/.cache/fragments`, schema);
            _context4.next = 4;
            return runner.compileAll();

          case 4:
            queries = _context4.sent;
            return _context4.abrupt("return", queries);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  function compile() {
    return _ref6.apply(this, arguments);
  }

  return compile;
}();
//# sourceMappingURL=query-compiler.js.map