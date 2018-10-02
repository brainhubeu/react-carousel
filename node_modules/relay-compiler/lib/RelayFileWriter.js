/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayFileWriter
 * 
 * @format
 */

'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayCodeGenerator'),
    generate = _require.generate;

var _require2 = require('./GraphQLCompilerPublic'),
    ASTConvert = _require2.ASTConvert,
    CodegenDirectory = _require2.CodegenDirectory,
    CompilerContext = _require2.CompilerContext,
    SchemaUtils = _require2.SchemaUtils;

var _require3 = require('immutable'),
    ImmutableMap = _require3.Map;
// TODO T21875029 ../../relay-runtime/util/RelayConcreteNode


var isOperationDefinitionAST = SchemaUtils.isOperationDefinitionAST;

var RelayFileWriter = function () {
  function RelayFileWriter(options) {
    (0, _classCallCheck3['default'])(this, RelayFileWriter);
    var config = options.config,
        onlyValidate = options.onlyValidate,
        baseDocuments = options.baseDocuments,
        documents = options.documents,
        schema = options.schema;

    this._baseDocuments = baseDocuments || ImmutableMap();
    this._baseSchema = schema;
    this._config = config;
    this._documents = documents;
    this._onlyValidate = onlyValidate;

    validateConfig(this._config);
  }

  RelayFileWriter.prototype.writeAll = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* () {
      var _this = this;

      var tStart = Date.now();

      // Can't convert to IR unless the schema already has Relay-local extensions
      var transformedSchema = ASTConvert.transformASTSchema(this._baseSchema, this._config.schemaExtensions);
      var extendedSchema = ASTConvert.extendASTSchema(transformedSchema, this._baseDocuments.merge(this._documents).valueSeq().toArray());

      // Build a context from all the documents
      var baseDefinitionNames = new Set();
      this._baseDocuments.forEach(function (doc) {
        doc.definitions.forEach(function (def) {
          if (isOperationDefinitionAST(def) && def.name) {
            baseDefinitionNames.add(def.name.value);
          }
        });
      });
      var definitionDirectories = new Map();
      var allOutputDirectories = new Map();
      var addCodegenDir = function addCodegenDir(dirPath) {
        var codegenDir = new CodegenDirectory(dirPath, {
          onlyValidate: _this._onlyValidate
        });
        allOutputDirectories.set(dirPath, codegenDir);
        return codegenDir;
      };

      var configOutputDirectory = void 0;
      if (this._config.outputDir) {
        configOutputDirectory = addCodegenDir(this._config.outputDir);
      } else {
        this._documents.forEach(function (doc, filePath) {
          doc.definitions.forEach(function (def) {
            if (isOperationDefinitionAST(def) && def.name) {
              definitionDirectories.set(def.name.value, require('path').join(_this._config.baseDir, require('path').dirname(filePath)));
            }
          });
        });
      }

      var definitions = ASTConvert.convertASTDocumentsWithBase(extendedSchema, this._baseDocuments.valueSeq().toArray(), this._documents.valueSeq().toArray(),
      // Verify using local and global rules, can run global verifications here
      // because all files are processed together
      [].concat((0, _toConsumableArray3['default'])(require('./RelayValidator').LOCAL_RULES), (0, _toConsumableArray3['default'])(require('./RelayValidator').GLOBAL_RULES)), require('./RelayParser').transform.bind(require('./RelayParser')));

      var compilerContext = new CompilerContext(extendedSchema);
      var compiler = new (require('./RelayCompiler'))(this._baseSchema, compilerContext, this._config.compilerTransforms, generate);

      var getGeneratedDirectory = function getGeneratedDirectory(definitionName) {
        if (configOutputDirectory) {
          return configOutputDirectory;
        }
        var definitionDir = definitionDirectories.get(definitionName);
        require('fbjs/lib/invariant')(definitionDir, 'RelayFileWriter: Could not determine source directory for definition: %s', definitionName);
        var generatedPath = require('path').join(definitionDir, '__generated__');
        var cachedDir = allOutputDirectories.get(generatedPath);
        if (!cachedDir) {
          cachedDir = addCodegenDir(generatedPath);
        }
        return cachedDir;
      };

      compiler.addDefinitions(definitions);

      var transformedFlowContext = require('./RelayFlowGenerator').flowTransforms.reduce(function (ctx, transform) {
        return transform(ctx, extendedSchema);
      }, compiler.context());
      var transformedQueryContext = compiler.transformedQueryContext();
      var compiledDocumentMap = compiler.compile();

      var tCompiled = Date.now();

      var tGenerated = void 0;
      try {
        yield Promise.all(transformedFlowContext.documents().map((() => {
          var _ref2 = (0, _asyncToGenerator3.default)(function* (node) {
            if (baseDefinitionNames.has(node.name)) {
              // don't add definitions that were part of base context
              return;
            }

            var flowTypes = require('./RelayFlowGenerator').generate(node, _this._config.customScalars, _this._config.inputFieldWhiteListForFlow);

            var compiledNode = compiledDocumentMap.get(node.name);
            require('fbjs/lib/invariant')(compiledNode, 'RelayCompiler: did not compile definition: %s', node.name);
            yield require('./writeRelayGeneratedFile')(getGeneratedDirectory(compiledNode.name), getGeneratedNode(compiledNode), _this._config.formatModule, flowTypes, _this._config.persistQuery, _this._config.platform, _this._config.relayRuntimeModule || 'relay-runtime');
          });

          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        })()));
        tGenerated = Date.now();

        if (this._config.generateExtraFiles) {
          var configDirectory = this._config.outputDir;
          this._config.generateExtraFiles(function (dir) {
            var outputDirectory = dir || configDirectory;
            require('fbjs/lib/invariant')(outputDirectory, 'RelayFileWriter: cannot generate extra files without specifying ' + 'an outputDir in the config or passing it in.');
            var outputDir = allOutputDirectories.get(outputDirectory);
            if (!outputDir) {
              outputDir = addCodegenDir(outputDirectory);
            }
            return outputDir;
          }, transformedQueryContext, getGeneratedDirectory);
        }

        // clean output directories
        allOutputDirectories.forEach(function (dir) {
          dir.deleteExtraFiles();
        });
      } catch (error) {
        tGenerated = Date.now();
        var details = void 0;
        try {
          details = JSON.parse(error.message);
        } catch (_) {}
        if (details && details.name === 'GraphQL2Exception' && details.message) {
          throw new Error('GraphQL error writing modules:\n' + details.message);
        }
        throw new Error('Error writing modules:\n' + error.toString());
      }

      var tExtra = Date.now();
      // eslint-disable-next-line no-console
      console.log('Writer time: %s [%s compiling, %s generating, %s extra]', toSeconds(tStart, tExtra), toSeconds(tStart, tCompiled), toSeconds(tCompiled, tGenerated), toSeconds(tGenerated, tExtra));
      return allOutputDirectories;
    });

    function writeAll() {
      return _ref.apply(this, arguments);
    }

    return writeAll;
  })();

  return RelayFileWriter;
}();

function getGeneratedNode(compiledNode) {
  require('fbjs/lib/invariant')(typeof compiledNode === 'object' && compiledNode !== null && (compiledNode.kind === 'Fragment' || compiledNode.kind === 'Batch'), 'getGeneratedNode: Expected a GeneratedNode, got `%s`.', JSON.stringify(compiledNode));
  return compiledNode;
}

function toSeconds(t0, t1) {
  return ((t1 - t0) / 1000).toFixed(2) + 's';
}

function validateConfig(config) {
  if (config.buildCommand) {
    process.stderr.write('WARNING: RelayFileWriter: For RelayFileWriter to work you must ' + 'replace config.buildCommand with config.formatModule.\n');
  }
}

module.exports = RelayFileWriter;