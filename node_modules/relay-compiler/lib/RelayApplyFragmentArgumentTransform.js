/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayApplyFragmentArgumentTransform
 * 
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    CompilerContext = _require.CompilerContext,
    getIdentifierForArgumentValue = _require.getIdentifierForArgumentValue;

var getFragmentScope = require('./RelayCompilerScope').getFragmentScope,
    getRootScope = require('./RelayCompilerScope').getRootScope;

/**
 * A tranform that converts a set of documents containing fragments/fragment
 * spreads *with* arguments to one where all arguments have been inlined. This
 * is effectively static currying of functions. Nodes are changed as follows:
 * - Fragment spreads with arguments are replaced with references to an inlined
 *   version of the referenced fragment.
 * - Fragments with argument definitions are cloned once per unique set of
 *   arguments, with the name changed to original name + hash and all nested
 *   variable references changed to the value of that variable given its
 *   arguments.
 * - Field & directive argument variables are replaced with the value of those
 *   variables in context.
 * - All nodes are cloned with updated children.
 *
 * The transform also handles statically passing/failing Condition nodes:
 * - Literal Conditions with a passing value are elided and their selections
 *   inlined in their parent.
 * - Literal Conditions with a failing value are removed.
 * - Nodes that would become empty as a result of the above are removed.
 *
 * Note that unreferenced fragments are not added to the output.
 */


function transform(context) {
  var documents = context.documents();
  var fragments = new (require('fbjs/lib/Map'))();
  var nextContext = new CompilerContext(context.schema);
  nextContext = documents.reduce(function (ctx, node) {
    if (node.kind === 'Root') {
      var scope = getRootScope(node.argumentDefinitions);
      var transformedNode = transformNode(context, fragments, scope, node);
      return transformedNode ? ctx.add(transformedNode) : ctx;
    } else {
      // fragments are transformed when referenced; unreferenced fragments are
      // not added to the output.
      return ctx;
    }
  }, nextContext);
  return Array.from(fragments.values()).reduce(function (ctx, fragment) {
    return fragment ? ctx.add(fragment) : ctx;
  }, nextContext);
}

function transformNode(context, fragments, scope, node) {
  var selections = transformSelections(context, fragments, scope, node.selections);
  if (!selections) {
    return null;
  }
  if (node.hasOwnProperty('directives')) {
    var directives = transformDirectives(scope, node.directives);
    // $FlowIssue: this is a valid `Node`:
    return (0, _extends3['default'])({}, node, {
      directives: directives,
      selections: selections
    });
  }
  return (0, _extends3['default'])({}, node, {
    selections: selections
  });
}

function transformFragmentSpread(context, fragments, scope, spread) {
  var directives = transformDirectives(scope, spread.directives);
  var fragment = context.getFragment(spread.name);
  var appliedFragment = transformFragment(context, fragments, scope, fragment, spread.args);
  if (!appliedFragment) {
    return null;
  }
  return (0, _extends3['default'])({}, spread, {
    args: [],
    directives: directives,
    name: appliedFragment.name
  });
}

function transformField(context, fragments, scope, field) {
  var args = transformArguments(scope, field.args);
  var directives = transformDirectives(scope, field.directives);
  if (field.kind === 'LinkedField') {
    var selections = transformSelections(context, fragments, scope, field.selections);
    if (!selections) {
      return null;
    }
    // $FlowFixMe(>=0.28.0)
    return (0, _extends3['default'])({}, field, {
      args: args,
      directives: directives,
      selections: selections
    });
  } else {
    return (0, _extends3['default'])({}, field, {
      args: args,
      directives: directives
    });
  }
}

function transformCondition(context, fragments, scope, node) {
  var condition = transformValue(scope, node.condition);
  require('fbjs/lib/invariant')(condition.kind === 'Literal' || condition.kind === 'Variable', 'RelayApplyFragmentArgumentTransform: A non-scalar value was applied to ' + 'an @include or @skip directive, the `if` argument value must be a ' + 'variable or a Boolean, got `%s`.', condition);
  if (condition.kind === 'Literal' && condition.value !== node.passingValue) {
    // Dead code, no need to traverse further.
    return null;
  }
  var selections = transformSelections(context, fragments, scope, node.selections);
  if (!selections) {
    return null;
  }
  if (condition.kind === 'Literal' && condition.value === node.passingValue) {
    // Always passes, return inlined selections
    return selections;
  }
  return [(0, _extends3['default'])({}, node, {
    condition: condition,
    selections: selections
  })];
}

function transformSelections(context, fragments, scope, selections) {
  var nextSelections = null;
  selections.forEach(function (selection) {
    var nextSelection = void 0;
    if (selection.kind === 'InlineFragment') {
      nextSelection = transformNode(context, fragments, scope, selection);
    } else if (selection.kind === 'FragmentSpread') {
      nextSelection = transformFragmentSpread(context, fragments, scope, selection);
    } else if (selection.kind === 'Condition') {
      var conditionSelections = transformCondition(context, fragments, scope, selection);
      if (conditionSelections) {
        var _nextSelections;

        nextSelections = nextSelections || [];
        (_nextSelections = nextSelections).push.apply(_nextSelections, (0, _toConsumableArray3['default'])(conditionSelections));
      }
    } else {
      nextSelection = transformField(context, fragments, scope, selection);
    }
    if (nextSelection) {
      nextSelections = nextSelections || [];
      nextSelections.push(nextSelection);
    }
  });
  return nextSelections;
}

function transformDirectives(scope, directives) {
  return directives.map(function (directive) {
    var args = transformArguments(scope, directive.args);
    return (0, _extends3['default'])({}, directive, {
      args: args
    });
  });
}

function transformArguments(scope, args) {
  return args.map(function (arg) {
    var value = transformValue(scope, arg.value);
    return value === arg.value ? arg : (0, _extends3['default'])({}, arg, { value: value });
  });
}

function transformValue(scope, value) {
  if (value.kind === 'Variable') {
    var scopeValue = scope[value.variableName];
    require('fbjs/lib/invariant')(scopeValue != null, 'RelayApplyFragmentArgumentTransform: variable `%s` is not in scope.', value.variableName);
    return scopeValue;
  } else if (value.kind === 'ListValue') {
    return (0, _extends3['default'])({}, value, {
      items: value.items.map(function (item) {
        return transformValue(scope, item);
      })
    });
  } else if (value.kind === 'ObjectValue') {
    return (0, _extends3['default'])({}, value, {
      fields: value.fields.map(function (field) {
        return (0, _extends3['default'])({}, field, {
          value: transformValue(scope, field.value)
        });
      })
    });
  }
  return value;
}

/**
 * Apply arguments to a fragment, creating a new fragment (with the given name)
 * with all values recursively applied.
 */
function transformFragment(context, fragments, parentScope, fragment, args) {
  var argumentsHash = hashArguments(args, parentScope);
  var fragmentName = argumentsHash ? fragment.name + '_' + argumentsHash : fragment.name;
  var appliedFragment = fragments.get(fragmentName);
  if (appliedFragment) {
    return appliedFragment;
  }
  var fragmentScope = getFragmentScope(fragment.argumentDefinitions, args, parentScope);
  require('fbjs/lib/invariant')(!fragments.has(fragmentName) || fragments.get(fragmentName) !== undefined, 'RelayApplyFragmentArgumentTransform: Found a circular reference from ' + 'fragment `%s`.', fragment.name);
  fragments.set(fragmentName, undefined); // to detect circular references
  var transformedFragment = null;
  var selections = transformSelections(context, fragments, fragmentScope, fragment.selections);
  if (selections) {
    transformedFragment = (0, _extends3['default'])({}, fragment, {
      selections: selections,
      name: fragmentName,
      argumentDefinitions: []
    });
  }
  fragments.set(fragmentName, transformedFragment);
  return transformedFragment;
}

function hashArguments(args, scope) {
  if (!args.length) {
    return null;
  }
  var sortedArgs = [].concat((0, _toConsumableArray3['default'])(args)).sort(function (a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  var printedArgs = JSON.stringify(sortedArgs.map(function (arg) {
    var value = void 0;
    if (arg.value.kind === 'Variable') {
      value = scope[arg.value.variableName];
      require('fbjs/lib/invariant')(value != null, 'RelayApplyFragmentArgumentTransform: variable `%s` is not in scope.', arg.value.variableName);
    } else {
      value = arg.value;
    }
    return {
      name: arg.name,
      value: getIdentifierForArgumentValue(value)
    };
  }));
  return require('./murmurHash')(printedArgs);
}

module.exports = { transform: transform };