/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule GraphQLCompiler
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * A utility class for parsing a corpus of GraphQL documents, transforming them
 * with a standardized set of transforms, and generating runtime representations
 * of each definition.
 */


// <CodegenNode> is a generic type here,
// which represents the node type we get from the CodeGenerator's generation function.
var GraphQLCompiler = function () {

  // The context passed in must already have any Relay-specific schema extensions
  function GraphQLCompiler(schema, context, transforms, codeGenerator) {
    (0, _classCallCheck3['default'])(this, GraphQLCompiler);

    this._context = context;
    // some transforms depend on this being the original schema,
    // not the transformed schema/context's schema
    this._schema = schema;
    this._transforms = transforms;
    this._codeGenerator = codeGenerator;
  }

  GraphQLCompiler.prototype.clone = function clone() {
    return new GraphQLCompiler(this._schema, this._context, this._transforms, this._codeGenerator);
  };

  GraphQLCompiler.prototype.context = function context() {
    return this._context;
  };

  GraphQLCompiler.prototype.addDefinitions = function addDefinitions(definitions) {
    this._context = this._context.addAll(definitions);
    return this._context.documents();
  };

  // Can only be called once per compiler. Once run, will use cached context
  // To re-run, clone the compiler.


  GraphQLCompiler.prototype.transformedQueryContext = function transformedQueryContext() {
    var _this = this;

    if (this._transformedQueryContext) {
      return this._transformedQueryContext;
    }
    this._transformedQueryContext = this._transforms.queryTransforms.reduce(function (ctx, transform) {
      return transform(ctx, _this._schema);
    }, this._context);
    return this._transformedQueryContext;
  };

  GraphQLCompiler.prototype.compile = function compile() {
    var _this2 = this;

    var transformContext = function transformContext(ctx, transform) {
      return transform(ctx, _this2._schema);
    };
    var fragmentContext = this._transforms.fragmentTransforms.reduce(transformContext, this._context);
    var queryContext = this.transformedQueryContext();
    var printContext = this._transforms.printTransforms.reduce(transformContext, queryContext);
    var codeGenContext = this._transforms.codegenTransforms.reduce(transformContext, queryContext);

    var compiledDocuments = new Map();
    fragmentContext.documents().forEach(function (node) {
      if (node.kind !== 'Fragment') {
        return;
      }
      var generatedFragment = _this2._codeGenerator(node);
      compiledDocuments.set(node.name, generatedFragment);
    });
    queryContext.documents().forEach(function (node) {
      if (node.kind !== 'Root') {
        return;
      }
      var name = node.name;
      // The unflattened query is used for printing, since flattening creates an
      // invalid query.

      var text = require('./filterContextForNode')(printContext.getRoot(name), printContext).documents().map(require('./GraphQLIRPrinter').print).join('\n');
      // The original query (with fragment spreads) is converted to a fragment
      // for reading out the root data.
      var sourceNode = fragmentContext.getRoot(name);
      var rootFragment = buildFragmentForRoot(sourceNode);
      var generatedFragment = _this2._codeGenerator(rootFragment);
      // The flattened query is used for codegen in order to reduce the number of
      // duplicate fields that must be processed during response normalization.
      var codeGenNode = codeGenContext.getRoot(name);
      var generatedQuery = _this2._codeGenerator(codeGenNode);

      var batchQuery = {
        fragment: generatedFragment,
        id: null,
        kind: 'Batch',
        metadata: node.metadata || {},
        name: name,
        query: generatedQuery,
        text: text
      };
      compiledDocuments.set(name, batchQuery);
    });
    return compiledDocuments;
  };

  return GraphQLCompiler;
}();

/**
 * Construct the fragment equivalent of a root node.
 */


function buildFragmentForRoot(root) {
  return {
    argumentDefinitions: root.argumentDefinitions,
    directives: root.directives,
    kind: 'Fragment',
    metadata: null,
    name: root.name,
    selections: root.selections,
    type: root.type
  };
}

module.exports = GraphQLCompiler;