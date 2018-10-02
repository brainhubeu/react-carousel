/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayCodeGenerator
 * 
 * @format
 */

'use strict';

// TODO T21875029 ../../relay-runtime/util/formatStorageKey

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
// TODO T21875029 ../../relay-runtime/util/prettyStringify


var _require = require('./GraphQLCompilerPublic'),
    IRVisitor = _require.IRVisitor,
    SchemaUtils = _require.SchemaUtils;

var _require2 = require('graphql'),
    GraphQLList = _require2.GraphQLList;
// TODO T21875029 ../../relay-runtime/util/RelayConcreteNode


var getRawType = SchemaUtils.getRawType,
    isAbstractType = SchemaUtils.isAbstractType,
    getNullableType = SchemaUtils.getNullableType;


/**
 * @public
 *
 * Converts a GraphQLIR node into a plain JS object representation that can be
 * used at runtime.
 */
function generate(node) {
  require('fbjs/lib/invariant')(['Root', 'Fragment'].indexOf(node.kind) >= 0, 'RelayCodeGenerator: Unknown AST kind `%s`. Source: %s.', node.kind, getErrorMessage(node));
  return IRVisitor.visit(node, RelayCodeGenVisitor);
}

var RelayCodeGenVisitor = {
  leave: {
    Root: function Root(node) {
      return {
        argumentDefinitions: node.argumentDefinitions,
        kind: 'Root',
        name: node.name,
        operation: node.operation,
        selections: flattenArray(node.selections)
      };
    },
    Fragment: function Fragment(node) {
      return {
        argumentDefinitions: node.argumentDefinitions,
        kind: 'Fragment',
        metadata: node.metadata || null,
        name: node.name,
        selections: flattenArray(node.selections),
        type: node.type.toString()
      };
    },
    LocalArgumentDefinition: function LocalArgumentDefinition(node) {
      return {
        kind: 'LocalArgument',
        name: node.name,
        type: node.type.toString(),
        defaultValue: node.defaultValue
      };
    },
    RootArgumentDefinition: function RootArgumentDefinition(node) {
      return {
        kind: 'RootArgument',
        name: node.name,
        type: node.type ? node.type.toString() : null
      };
    },
    Condition: function Condition(node, key, parent, ancestors) {
      require('fbjs/lib/invariant')(node.condition.kind === 'Variable', 'RelayCodeGenerator: Expected static `Condition` node to be ' + 'pruned or inlined. Source: %s.', getErrorMessage(ancestors[0]));
      return {
        kind: 'Condition',
        passingValue: node.passingValue,
        condition: node.condition.variableName,
        selections: flattenArray(node.selections)
      };
    },
    FragmentSpread: function FragmentSpread(node) {
      return {
        kind: 'FragmentSpread',
        name: node.name,
        args: valuesOrNull(sortByName(node.args))
      };
    },
    InlineFragment: function InlineFragment(node) {
      return {
        kind: 'InlineFragment',
        type: node.typeCondition.toString(),
        selections: flattenArray(node.selections)
      };
    },
    LinkedField: function LinkedField(node) {
      var handles = node.handles && node.handles.map(function (handle) {
        return {
          kind: 'LinkedHandle',
          alias: node.alias,
          args: valuesOrNull(sortByName(node.args)),
          handle: handle.name,
          name: node.name,
          key: handle.key,
          filters: handle.filters
        };
      }) || [];
      var type = getRawType(node.type);
      return [{
        kind: 'LinkedField',
        alias: node.alias,
        args: valuesOrNull(sortByName(node.args)),
        concreteType: !isAbstractType(type) ? type.toString() : null,
        name: node.name,
        plural: isPlural(node.type),
        selections: flattenArray(node.selections),
        storageKey: getStorageKey(node.name, node.args)
      }].concat((0, _toConsumableArray3['default'])(handles));
    },
    ScalarField: function ScalarField(node) {
      var handles = node.handles && node.handles.map(function (handle) {
        return {
          kind: 'ScalarHandle',
          alias: node.alias,
          args: valuesOrNull(sortByName(node.args)),
          handle: handle.name,
          name: node.name,
          key: handle.key,
          filters: handle.filters
        };
      }) || [];
      return [{
        kind: 'ScalarField',
        alias: node.alias,
        args: valuesOrNull(sortByName(node.args)),
        name: node.name,
        selections: valuesOrUndefined(flattenArray(node.selections)),
        storageKey: getStorageKey(node.name, node.args)
      }].concat((0, _toConsumableArray3['default'])(handles));
    },
    Variable: function Variable(node, key, parent) {
      return {
        kind: 'Variable',
        name: parent.name,
        variableName: node.variableName,
        type: parent.type ? parent.type.toString() : null
      };
    },
    Literal: function Literal(node, key, parent) {
      return {
        kind: 'Literal',
        name: parent.name,
        value: node.value,
        type: parent.type ? parent.type.toString() : null
      };
    },
    Argument: function Argument(node, key, parent, ancestors) {
      require('fbjs/lib/invariant')(['Variable', 'Literal'].indexOf(node.value.kind) >= 0, 'RelayCodeGenerator: Complex argument values (Lists or ' + 'InputObjects with nested variables) are not supported, argument ' + '`%s` had value `%s`. Source: %s.', node.name, require('./prettyStringify')(node.value), getErrorMessage(ancestors[0]));
      return node.value.value !== null ? node.value : null;
    }
  }
};

function isPlural(type) {
  return getNullableType(type) instanceof GraphQLList;
}

function valuesOrUndefined(array) {
  return !array || array.length === 0 ? undefined : array;
}

function valuesOrNull(array) {
  return !array || array.length === 0 ? null : array;
}

function flattenArray(array) {
  return array ? Array.prototype.concat.apply([], array) : [];
}

function sortByName(array) {
  return array instanceof Array ? array.sort(function (a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  }) : array;
}

function getErrorMessage(node) {
  return 'document ' + node.name;
}

/**
 * Computes storage key if possible.
 *
 * Storage keys which can be known ahead of runtime are:
 *
 * - Fields that do not take arguments.
 * - Fields whose arguments are all statically known (ie. literals) at build
 *   time.
 */
function getStorageKey(fieldName, args) {
  if (!args || !args.length) {
    return null;
  }
  var isLiteral = true;
  var preparedArgs = {};
  args.forEach(function (arg) {
    if (arg.kind !== 'Literal') {
      isLiteral = false;
    } else {
      preparedArgs[arg.name] = arg.value;
    }
  });
  return isLiteral ? require('./formatStorageKey')(fieldName, preparedArgs) : null;
}

module.exports = { generate: generate };