/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayFlowGenerator
 * 
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    FlattenTransform = _require.FlattenTransform,
    IRVisitor = _require.IRVisitor,
    SchemaUtils = _require.SchemaUtils;

var _require2 = require('./RelayFlowBabelFactories'),
    exactObjectTypeAnnotation = _require2.exactObjectTypeAnnotation,
    exportType = _require2.exportType,
    lineComments = _require2.lineComments,
    readOnlyArrayOfType = _require2.readOnlyArrayOfType,
    readOnlyObjectTypeProperty = _require2.readOnlyObjectTypeProperty,
    stringLiteralTypeAnnotation = _require2.stringLiteralTypeAnnotation;

var _require3 = require('./RelayFlowTypeTransformers'),
    transformScalarType = _require3.transformScalarType,
    transformInputType = _require3.transformInputType;

var _require4 = require('graphql'),
    GraphQLNonNull = _require4.GraphQLNonNull;

var babelGenerator = require('babel-generator')['default'];

var isAbstractType = SchemaUtils.isAbstractType;


function generate(node, customScalars, inputFieldWhiteList) {
  var ast = IRVisitor.visit(node, createVisitor(customScalars || {}, inputFieldWhiteList));
  return babelGenerator(ast).code;
}

function makeProp(_ref, customScalars, concreteType) {
  var key = _ref.key,
      schemaName = _ref.schemaName,
      value = _ref.value,
      conditional = _ref.conditional,
      nodeType = _ref.nodeType,
      nodeSelections = _ref.nodeSelections;

  if (nodeType) {
    value = transformScalarType(nodeType, customScalars, selectionsToBabel([Array.from(nodeSelections.values())], customScalars));
  }
  if (schemaName === '__typename' && concreteType) {
    value = stringLiteralTypeAnnotation(concreteType);
  }
  var typeProperty = readOnlyObjectTypeProperty(key, value);
  if (conditional) {
    typeProperty.optional = true;
  }
  return typeProperty;
}

var isTypenameSelection = function isTypenameSelection(selection) {
  return selection.schemaName === '__typename';
};
var hasTypenameSelection = function hasTypenameSelection(selections) {
  return selections.some(isTypenameSelection);
};
var onlySelectsTypename = function onlySelectsTypename(selections) {
  return selections.every(isTypenameSelection);
};

function selectionsToBabel(selections, customScalars) {
  var baseFields = new Map();
  var byConcreteType = {};

  flattenArray(selections).forEach(function (selection) {
    var concreteType = selection.concreteType;

    if (concreteType) {
      byConcreteType[concreteType] = byConcreteType[concreteType] || [];
      byConcreteType[concreteType].push(selection);
    } else {
      var previousSel = baseFields.get(selection.key);

      baseFields.set(selection.key, previousSel ? mergeSelection(selection, previousSel) : selection);
    }
  });

  var types = [];

  if (Object.keys(byConcreteType).length && onlySelectsTypename(Array.from(baseFields.values())) && (hasTypenameSelection(Array.from(baseFields.values())) || Object.keys(byConcreteType).every(function (type) {
    return hasTypenameSelection(byConcreteType[type]);
  }))) {
    var _loop = function _loop(concreteType) {
      types.push(exactObjectTypeAnnotation([].concat((0, _toConsumableArray3['default'])(Array.from(baseFields.values()).map(function (selection) {
        return makeProp(selection, customScalars, concreteType);
      })), (0, _toConsumableArray3['default'])(byConcreteType[concreteType].map(function (selection) {
        return makeProp(selection, customScalars, concreteType);
      })))));
    };

    for (var concreteType in byConcreteType) {
      _loop(concreteType);
    }
    // It might be some other type then the listed concrete types. Ideally, we
    // would set the type to diff(string, set of listed concrete types), but
    // this doesn't exist in Flow at the time.
    var otherProp = readOnlyObjectTypeProperty('__typename', stringLiteralTypeAnnotation('%other'));
    otherProp.leadingComments = lineComments("This will never be '%other', but we need some", 'value in case none of the concrete values match.');
    types.push(exactObjectTypeAnnotation([otherProp]));
  } else {
    var selectionMap = selectionsToMap(Array.from(baseFields.values()));
    for (var concreteType in byConcreteType) {
      selectionMap = mergeSelections(selectionMap, selectionsToMap(byConcreteType[concreteType].map(function (sel) {
        return (0, _extends3['default'])({}, sel, {
          conditional: true
        });
      })));
    }
    var selectionMapValues = Array.from(selectionMap.values()).map(function (sel) {
      return isTypenameSelection(sel) && sel.concreteType ? makeProp((0, _extends3['default'])({}, sel, { conditional: false }), customScalars, sel.concreteType) : makeProp(sel, customScalars);
    });
    types.push(exactObjectTypeAnnotation(selectionMapValues));
  }

  if (types.length === 0) {
    return exactObjectTypeAnnotation([]);
  }

  return types.length > 1 ? require('babel-types').unionTypeAnnotation(types) : types[0];
}

function mergeSelection(a, b) {
  if (!a) {
    return (0, _extends3['default'])({}, b, {
      conditional: true
    });
  }
  return (0, _extends3['default'])({}, a, {
    nodeSelections: a.nodeSelections ? mergeSelections(a.nodeSelections, b.nodeSelections) : null,
    conditional: a.conditional && b.conditional
  });
}

function mergeSelections(a, b) {
  var merged = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = a.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _step.value,
          key = _step$value[0],
          value = _step$value[1];

      merged.set(key, value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = b.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _step2.value,
          key = _step2$value[0],
          value = _step2$value[1];

      merged.set(key, mergeSelection(a.get(key), value));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return merged;
}

function isPlural(_ref2) {
  var directives = _ref2.directives;

  var relayDirective = directives.find(function (_ref3) {
    var name = _ref3.name;
    return name === 'relay';
  });
  return relayDirective != null && relayDirective.args.some(function (_ref4) {
    var name = _ref4.name,
        value = _ref4.value;
    return name === 'plural' && value.value;
  });
}

function createVisitor(customScalars, inputFieldWhiteList) {
  return {
    leave: {
      Root: function Root(node) {
        var statements = [];
        if (node.operation !== 'query') {
          statements.push(generateInputVariablesType(node, customScalars, inputFieldWhiteList));
        }
        statements.push(exportType(node.name + 'Response', selectionsToBabel(node.selections, customScalars)));
        return require('babel-types').program(statements);
      },
      Fragment: function Fragment(node) {
        var selections = flattenArray(node.selections);
        var numConecreteSelections = selections.filter(function (s) {
          return s.concreteType;
        }).length;
        selections = selections.map(function (selection) {
          if (numConecreteSelections <= 1 && isTypenameSelection(selection) && !isAbstractType(node.type)) {
            return [(0, _extends3['default'])({}, selection, {
              concreteType: node.type.toString()
            })];
          }
          return [selection];
        });
        var baseType = selectionsToBabel(selections, customScalars);
        var type = isPlural(node) ? readOnlyArrayOfType(baseType) : baseType;

        return require('babel-types').program([exportType(node.name, type)]);
      },
      InlineFragment: function InlineFragment(node) {
        var typeCondition = node.typeCondition;
        return flattenArray(node.selections).map(function (typeSelection) {
          return isAbstractType(typeCondition) ? (0, _extends3['default'])({}, typeSelection, {
            conditional: true
          }) : (0, _extends3['default'])({}, typeSelection, {
            concreteType: typeCondition.toString()
          });
        });
      },
      Condition: function Condition(node) {
        return flattenArray(node.selections).map(function (selection) {
          return (0, _extends3['default'])({}, selection, {
            conditional: true
          });
        });
      },
      ScalarField: function ScalarField(node) {
        return [{
          key: node.alias || node.name,
          schemaName: node.name,
          value: transformScalarType(node.type, customScalars)
        }];
      },
      LinkedField: function LinkedField(node) {
        return [{
          key: node.alias || node.name,
          schemaName: node.name,
          nodeType: node.type,
          nodeSelections: selectionsToMap(flattenArray(node.selections))
        }];
      },
      FragmentSpread: function FragmentSpread(node) {
        return [];
      }
    }
  };
}

function selectionsToMap(selections) {
  var map = new Map();
  selections.forEach(function (selection) {
    var previousSel = map.get(selection.key);
    map.set(selection.key, previousSel ? mergeSelection(previousSel, selection) : selection);
  });
  return map;
}

function flattenArray(arrayOfArrays) {
  var result = [];
  arrayOfArrays.forEach(function (array) {
    return result.push.apply(result, (0, _toConsumableArray3['default'])(array));
  });
  return result;
}

function generateInputVariablesType(node, customScalars, inputFieldWhiteList) {
  return exportType(node.name + 'Variables', exactObjectTypeAnnotation(node.argumentDefinitions.map(function (arg) {
    var property = require('babel-types').objectTypeProperty(require('babel-types').identifier(arg.name), transformInputType(arg.type, customScalars, inputFieldWhiteList));
    if (!(arg.type instanceof GraphQLNonNull)) {
      property.optional = true;
    }
    return property;
  })));
}

var FLOW_TRANSFORMS = [function (ctx) {
  return FlattenTransform.transform(ctx, {});
}];

module.exports = {
  generate: generate,
  flowTransforms: FLOW_TRANSFORMS
};