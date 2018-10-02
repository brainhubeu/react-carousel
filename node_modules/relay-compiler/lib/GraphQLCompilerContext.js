/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule GraphQLCompilerContext
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerUserError'),
    createUserError = _require.createUserError;

var ImmutableList = require('immutable').List,
    ImmutableOrderedMap = require('immutable').OrderedMap,
    Record = require('immutable').Record;

var Document = Record({
  errors: null,
  name: null,
  node: null
});

/**
 * An immutable representation of a corpus of documents being compiled together.
 * For each document, the context stores the IR and any validation errors.
 */

var GraphQLCompilerContext = function () {
  function GraphQLCompilerContext(schema) {
    (0, _classCallCheck3['default'])(this, GraphQLCompilerContext);

    this._documents = new ImmutableOrderedMap();
    this.schema = schema;
  }

  /**
   * Returns the documents for the context in the order they were added.
   */


  GraphQLCompilerContext.prototype.documents = function documents() {
    return this._documents.valueSeq().map(function (doc) {
      return doc.get('node');
    }).toJS();
  };

  GraphQLCompilerContext.prototype.updateSchema = function updateSchema(schema) {
    var context = new GraphQLCompilerContext(schema);
    context._documents = this._documents;
    return context;
  };

  GraphQLCompilerContext.prototype.add = function add(node) {
    require('fbjs/lib/invariant')(!this._documents.has(node.name), 'GraphQLCompilerContext: Duplicate document named `%s`. GraphQL ' + 'fragments and roots must have unique names.', node.name);
    return this._update(this._documents.set(node.name, new Document({
      name: node.name,
      node: node
    })));
  };

  GraphQLCompilerContext.prototype.addAll = function addAll(nodes) {
    return nodes.reduce(function (ctx, definition) {
      return ctx.add(definition);
    }, this);
  };

  GraphQLCompilerContext.prototype.addError = function addError(name, error) {
    var record = this._get(name);
    var errors = record.get('errors');
    if (errors) {
      errors = errors.push(error);
    } else {
      errors = ImmutableList([error]);
    }
    return this._update(this._documents.set(name, record.set('errors', errors)));
  };

  GraphQLCompilerContext.prototype.get = function get(name) {
    var record = this._documents.get(name);
    return record && record.get('node');
  };

  GraphQLCompilerContext.prototype.getFragment = function getFragment(name) {
    var record = this._documents.get(name);
    var node = record && record.get('node');
    if (!(node && node.kind === 'Fragment')) {
      var childModule = name.substring(0, name.lastIndexOf('_'));
      throw createUserError('GraphQLCompilerContext: Cannot find fragment `%s`.' + ' Please make sure the fragment exists in `%s`.', name, childModule);
    }
    return node;
  };

  GraphQLCompilerContext.prototype.getRoot = function getRoot(name) {
    var record = this._documents.get(name);
    var node = record && record.get('node');
    require('fbjs/lib/invariant')(node && node.kind === 'Root', 'GraphQLCompilerContext: Expected `%s` to be a root, got `%s`.', name, node && node.kind);
    return node;
  };

  GraphQLCompilerContext.prototype.getErrors = function getErrors(name) {
    return this._get(name).get('errors');
  };

  GraphQLCompilerContext.prototype.remove = function remove(name) {
    return this._update(this._documents['delete'](name));
  };

  GraphQLCompilerContext.prototype._get = function _get(name) {
    var record = this._documents.get(name);
    require('fbjs/lib/invariant')(record, 'GraphQLCompilerContext: Unknown document `%s`.', name);
    return record;
  };

  GraphQLCompilerContext.prototype._update = function _update(documents) {
    var context = new GraphQLCompilerContext(this.schema);
    context._documents = documents;
    return context;
  };

  return GraphQLCompilerContext;
}();

module.exports = GraphQLCompilerContext;