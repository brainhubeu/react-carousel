/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayConnectionTransform
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    getLiteralArgumentValues = _require.getLiteralArgumentValues,
    IRTransformer = _require.IRTransformer,
    SchemaUtils = _require.SchemaUtils;

var _require2 = require('./RelayConnectionConstants'),
    AFTER = _require2.AFTER,
    BEFORE = _require2.BEFORE,
    FIRST = _require2.FIRST,
    KEY = _require2.KEY,
    LAST = _require2.LAST;
// TODO T21875029 ../../../relay-runtime/RelayRuntime


var _require3 = require('relay-runtime'),
    ConnectionInterface = _require3.ConnectionInterface;

var _require4 = require('graphql'),
    assertCompositeType = _require4.assertCompositeType,
    GraphQLInterfaceType = _require4.GraphQLInterfaceType,
    GraphQLList = _require4.GraphQLList,
    GraphQLObjectType = _require4.GraphQLObjectType,
    GraphQLScalarType = _require4.GraphQLScalarType,
    GraphQLUnionType = _require4.GraphQLUnionType,
    parse = _require4.parse;
// TODO T21875029 ../../../relay-runtime/handlers/connection/RelayConnectionHandler


var CONNECTION = 'connection';

/**
 * @public
 *
 * Transforms fields with the `@connection` directive:
 * - Verifies that the field type is connection-like.
 * - Adds a `handle` property to the field, either the user-provided `handle`
 *   argument or the default value "connection".
 * - Inserts a sub-fragment on the field to ensure that standard connection
 *   fields are fetched (e.g. cursors, node ids, page info).
 */
function transform(context) {
  return IRTransformer.transform(context, {
    Fragment: visitFragmentOrRoot,
    LinkedField: visitLinkedField,
    Root: visitFragmentOrRoot
  }, function () {
    return {
      path: [],
      connectionMetadata: [],
      definitionName: null
    };
  });
}

var SCHEMA_EXTENSION = 'directive @connection(key: String!, filters: [String]) on FIELD';

/**
 * @internal
 */
function visitFragmentOrRoot(node, options) {
  var passedOptions = (0, _extends3['default'])({}, options, {
    definitionName: node.name
  });
  var transformedNode = this.traverse(node, passedOptions);
  var connectionMetadata = passedOptions.connectionMetadata;
  if (connectionMetadata.length) {
    return (0, _extends3['default'])({}, transformedNode, {
      metadata: (0, _extends3['default'])({}, transformedNode.metadata, {
        connection: connectionMetadata
      })
    });
  }
  return transformedNode;
}

/**
 * @internal
 */
function visitLinkedField(field, options) {
  var isPlural = SchemaUtils.getNullableType(field.type) instanceof GraphQLList;
  options.path.push(isPlural ? null : field.alias || field.name);
  var transformedField = this.traverse(field, options);
  var connectionDirective = field.directives.find(function (directive) {
    return directive.name === CONNECTION;
  });
  if (!connectionDirective) {
    options.path.pop();
    return transformedField;
  }
  var definitionName = options.definitionName;

  require('fbjs/lib/invariant')(definitionName, 'RelayConnectionTransform: Transform error, expected a name to have ' + 'been set by the parent operation or fragment definition.');
  validateConnectionSelection(definitionName, transformedField);
  validateConnectionType(definitionName, transformedField.type);

  var pathHasPlural = options.path.includes(null);
  var firstArg = findArg(transformedField, FIRST);
  var lastArg = findArg(transformedField, LAST);
  var direction = null;
  var countArg = null;
  var cursorArg = null;
  if (firstArg && !lastArg) {
    direction = 'forward';
    countArg = firstArg;
    cursorArg = findArg(transformedField, AFTER);
  } else if (lastArg && !firstArg) {
    direction = 'backward';
    countArg = lastArg;
    cursorArg = findArg(transformedField, BEFORE);
  }
  var countVariable = countArg && countArg.value.kind === 'Variable' ? countArg.value.variableName : null;
  var cursorVariable = cursorArg && cursorArg.value.kind === 'Variable' ? cursorArg.value.variableName : null;
  options.connectionMetadata.push({
    count: countVariable,
    cursor: cursorVariable,
    direction: direction,
    path: pathHasPlural ? null : [].concat((0, _toConsumableArray3['default'])(options.path))
  });
  options.path.pop();

  var _getLiteralArgumentVa = getLiteralArgumentValues(connectionDirective.args),
      key = _getLiteralArgumentVa.key,
      filters = _getLiteralArgumentVa.filters;

  require('fbjs/lib/invariant')(typeof key === 'string', 'RelayConnectionTransform: Expected the %s argument to @%s to ' + 'be a string literal for field %s', KEY, CONNECTION, field.name);
  var postfix = '' + (field.alias || field.name);
  require('fbjs/lib/invariant')(key.endsWith('_' + postfix), 'RelayConnectionTransform: Expected the %s argument to @%s to ' + 'be of form <SomeName>_%s, but get %s. For detailed explanation, check out the dex page ' + 'https://facebook.github.io/relay/docs/pagination-container.html#connection-directive', KEY, CONNECTION, postfix, key);

  var generateFilters = function generateFilters() {
    var filteredVariableArgs = field.args.filter(function (arg) {
      return !ConnectionInterface.isConnectionCall({
        name: arg.name,
        value: null
      });
    }).map(function (arg) {
      return arg.name;
    });
    return filteredVariableArgs.length === 0 ? null : filteredVariableArgs;
  };

  var handle = {
    name: CONNECTION,
    key: key,
    filters: filters || generateFilters()
  };

  if (direction !== null) {
    var fragment = generateConnectionFragment(this.getContext(), transformedField.type, direction);
    transformedField = (0, _extends3['default'])({}, transformedField, {
      selections: transformedField.selections.concat(fragment)
    });
  }
  return (0, _extends3['default'])({}, transformedField, {
    directives: transformedField.directives.filter(function (directive) {
      return directive.name !== CONNECTION;
    }),
    handles: transformedField.handles ? [].concat((0, _toConsumableArray3['default'])(transformedField.handles), [handle]) : [handle]
  });
}

/**
 * @internal
 *
 * Generates a fragment on the given type that fetches the minimal connection
 * fields in order to merge different pagination results together at runtime.
 */
function generateConnectionFragment(context, type, direction) {
  var _ConnectionInterface$ = ConnectionInterface.get(),
      CURSOR = _ConnectionInterface$.CURSOR,
      EDGES = _ConnectionInterface$.EDGES,
      END_CURSOR = _ConnectionInterface$.END_CURSOR,
      HAS_NEXT_PAGE = _ConnectionInterface$.HAS_NEXT_PAGE,
      HAS_PREV_PAGE = _ConnectionInterface$.HAS_PREV_PAGE,
      NODE = _ConnectionInterface$.NODE,
      PAGE_INFO = _ConnectionInterface$.PAGE_INFO,
      START_CURSOR = _ConnectionInterface$.START_CURSOR;

  var compositeType = assertCompositeType(SchemaUtils.getNullableType(type));

  var pageInfo = PAGE_INFO;
  if (direction === 'forward') {
    pageInfo += '{\n      ' + END_CURSOR + '\n      ' + HAS_NEXT_PAGE + '\n    }';
  } else {
    pageInfo += '{\n      ' + HAS_PREV_PAGE + '\n      ' + START_CURSOR + '\n    }';
  }

  var fragmentString = 'fragment ConnectionFragment on ' + String(compositeType) + ' {\n      ' + EDGES + ' {\n        ' + CURSOR + '\n        ' + NODE + ' {\n          __typename # rely on GenerateRequisiteFieldTransform to add "id"\n        }\n      }\n      ' + pageInfo + '\n    }';

  var ast = parse(fragmentString);
  var fragmentAST = ast.definitions[0];
  require('fbjs/lib/invariant')(fragmentAST && fragmentAST.kind === 'FragmentDefinition', 'RelayConnectionTransform: Expected a fragment definition AST.');
  var fragment = require('./RelayParser').transform(context.schema, fragmentAST);
  require('fbjs/lib/invariant')(fragment && fragment.kind === 'Fragment', 'RelayConnectionTransform: Expected a connection fragment.');
  return {
    directives: [],
    kind: 'InlineFragment',
    metadata: null,
    selections: fragment.selections,
    typeCondition: compositeType
  };
}

function findArg(field, argName) {
  return field.args && field.args.find(function (arg) {
    return arg.name === argName;
  });
}

/**
 * @internal
 *
 * Validates that the selection is a valid connection:
 * - Specifies a first or last argument to prevent accidental, unconstrained
 *   data access.
 * - Has an `edges` selection, otherwise there is nothing to paginate.
 *
 * TODO: This implementation requires the edges field to be a direct selection
 * and not contained within an inline fragment or fragment spread. It's
 * technically possible to remove this restriction if this pattern becomes
 * common/necessary.
 */
function validateConnectionSelection(definitionName, field) {
  var _ConnectionInterface$2 = ConnectionInterface.get(),
      EDGES = _ConnectionInterface$2.EDGES;

  require('fbjs/lib/invariant')(findArg(field, FIRST) || findArg(field, LAST), 'RelayConnectionTransform: Expected field `%s: %s` to have a %s or %s ' + 'argument in document `%s`.', field.name, field.type, FIRST, LAST, definitionName);
  require('fbjs/lib/invariant')(field.selections.some(function (selection) {
    return selection.kind === 'LinkedField' && selection.name === EDGES;
  }), 'RelayConnectionTransform: Expected field `%s: %s` to have a %s ' + 'selection in document `%s`.', field.name, field.type, EDGES, definitionName);
}

/**
 * @internal
 *
 * Validates that the type satisfies the Connection specification:
 * - The type has an edges field, and edges have scalar `cursor` and object
 *   `node` fields.
 * - The type has a page info field which is an object with the correct
 *   subfields.
 */
function validateConnectionType(definitionName, type) {
  var _ConnectionInterface$3 = ConnectionInterface.get(),
      CURSOR = _ConnectionInterface$3.CURSOR,
      EDGES = _ConnectionInterface$3.EDGES,
      END_CURSOR = _ConnectionInterface$3.END_CURSOR,
      HAS_NEXT_PAGE = _ConnectionInterface$3.HAS_NEXT_PAGE,
      HAS_PREV_PAGE = _ConnectionInterface$3.HAS_PREV_PAGE,
      NODE = _ConnectionInterface$3.NODE,
      PAGE_INFO = _ConnectionInterface$3.PAGE_INFO,
      START_CURSOR = _ConnectionInterface$3.START_CURSOR;

  var typeWithFields = SchemaUtils.assertTypeWithFields(SchemaUtils.getNullableType(type));
  var typeFields = typeWithFields.getFields();
  var edges = typeFields[EDGES];

  require('fbjs/lib/invariant')(edges, 'RelayConnectionTransform: Expected type `%s` to have an %s field in ' + 'document `%s`.', type, EDGES, definitionName);

  var edgesType = SchemaUtils.getNullableType(edges.type);
  require('fbjs/lib/invariant')(edgesType instanceof GraphQLList, 'RelayConnectionTransform: Expected `%s` field on type `%s` to be a ' + 'list type in document `%s`.', EDGES, type, definitionName);
  var edgeType = SchemaUtils.getNullableType(edgesType.ofType);
  require('fbjs/lib/invariant')(edgeType instanceof GraphQLObjectType, 'RelayConnectionTransform: Expected %s field on type `%s` to be a list ' + 'of objects in document `%s`.', EDGES, type, definitionName);

  var node = edgeType.getFields()[NODE];
  require('fbjs/lib/invariant')(node, 'RelayConnectionTransform: Expected type `%s` to have an %s.%s field in ' + 'document `%s`.', type, EDGES, NODE, definitionName);
  var nodeType = SchemaUtils.getNullableType(node.type);
  if (!(nodeType instanceof GraphQLInterfaceType || nodeType instanceof GraphQLUnionType || nodeType instanceof GraphQLObjectType)) {
    require('fbjs/lib/invariant')(false, 'RelayConnectionTransform: Expected type `%s` to have an %s.%s field' + 'for which the type is an interface, object, or union in document `%s`.', type, EDGES, NODE, definitionName);
  }

  var cursor = edgeType.getFields()[CURSOR];
  if (!cursor || !(SchemaUtils.getNullableType(cursor.type) instanceof GraphQLScalarType)) {
    require('fbjs/lib/invariant')(false, 'RelayConnectionTransform: Expected type `%s` to have an ' + '%s.%s field for which the type is a scalar in document `%s`.', type, EDGES, CURSOR, definitionName);
  }

  var pageInfo = typeFields[PAGE_INFO];
  require('fbjs/lib/invariant')(pageInfo, 'RelayConnectionTransform: Expected type `%s` to have a %s field ' + 'in document `%s`.', type, PAGE_INFO, definitionName);
  var pageInfoType = SchemaUtils.getNullableType(pageInfo.type);
  if (!(pageInfoType instanceof GraphQLObjectType)) {
    require('fbjs/lib/invariant')(false, 'RelayConnectionTransform: Expected type `%s` to have a %s field for ' + 'which the type is an object in document `%s`.', type, PAGE_INFO, definitionName);
  }

  [END_CURSOR, HAS_NEXT_PAGE, HAS_PREV_PAGE, START_CURSOR].forEach(function (fieldName) {
    var pageInfoField = pageInfoType.getFields()[fieldName];
    if (!pageInfoField || !(SchemaUtils.getNullableType(pageInfoField.type) instanceof GraphQLScalarType)) {
      require('fbjs/lib/invariant')(false, 'RelayConnectionTransform: Expected type `%s` to have an ' + '%s field for which the type is an scalar in document `%s`.', pageInfo.type, fieldName, definitionName);
    }
  });
}

module.exports = {
  CONNECTION: CONNECTION,
  SCHEMA_EXTENSION: SCHEMA_EXTENSION,
  transform: transform
};