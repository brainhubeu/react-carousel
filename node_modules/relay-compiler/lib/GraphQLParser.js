/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLParser
 * 
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./DefaultHandleKey'),
    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

var _require2 = require('./GraphQLSchemaUtils'),
    getNullableType = _require2.getNullableType,
    getRawType = _require2.getRawType,
    getTypeFromAST = _require2.getTypeFromAST,
    isOperationDefinitionAST = _require2.isOperationDefinitionAST;

var _require3 = require('graphql'),
    assertCompositeType = _require3.assertCompositeType,
    assertInputType = _require3.assertInputType,
    assertOutputType = _require3.assertOutputType,
    extendSchema = _require3.extendSchema,
    getNamedType = _require3.getNamedType,
    GraphQLEnumType = _require3.GraphQLEnumType,
    GraphQLInputObjectType = _require3.GraphQLInputObjectType,
    GraphQLInterfaceType = _require3.GraphQLInterfaceType,
    GraphQLList = _require3.GraphQLList,
    GraphQLObjectType = _require3.GraphQLObjectType,
    GraphQLScalarType = _require3.GraphQLScalarType,
    GraphQLUnionType = _require3.GraphQLUnionType,
    isLeafType = _require3.isLeafType,
    isTypeSubTypeOf = _require3.isTypeSubTypeOf,
    _parse = _require3.parse,
    parseType = _require3.parseType,
    SchemaMetaFieldDef = _require3.SchemaMetaFieldDef,
    Source = _require3.Source,
    TypeMetaFieldDef = _require3.TypeMetaFieldDef,
    TypeNameMetaFieldDef = _require3.TypeNameMetaFieldDef;

var ARGUMENT_DEFINITIONS = 'argumentDefinitions';
var ARGUMENTS = 'arguments';

/**
 * @internal
 *
 * This directive is not intended for use by developers directly. To set a field
 * handle in product code use a compiler plugin.
 */
var CLIENT_FIELD = '__clientField';
var CLIENT_FIELD_HANDLE = 'handle';
var CLIENT_FIELD_KEY = 'key';
var CLIENT_FIELD_FILTERS = 'filters';

var INCLUDE = 'include';
var SKIP = 'skip';
var IF = 'if';

var GraphQLParser = function () {
  GraphQLParser.parse = function parse(schema, text, filename) {
    var _this = this;

    var ast = _parse(new Source(text, filename));
    var nodes = [];
    schema = extendSchema(schema, ast);
    ast.definitions.forEach(function (definition) {
      if (isOperationDefinitionAST(definition)) {
        nodes.push(_this.transform(schema, definition));
      }
    }, this);
    return nodes;
  };

  /**
   * Transforms a raw GraphQL AST into a simpler representation with type
   * information.
   */


  GraphQLParser.transform = function transform(schema, definition) {
    var parser = new this(schema, definition);
    return parser.transform();
  };

  function GraphQLParser(schema, definition) {
    (0, _classCallCheck3['default'])(this, GraphQLParser);

    this._definition = definition;
    this._referencedVariables = {};
    this._schema = schema;
  }

  /**
   * Find the definition of a field of the specified type.
   */


  GraphQLParser.prototype.getFieldDefinition = function getFieldDefinition(parentType, fieldName, fieldAST) {
    var type = getRawType(parentType);
    var isQueryType = type === this._schema.getQueryType();
    var hasTypeName = type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;

    var schemaFieldDef = void 0;
    if (isQueryType && fieldName === SchemaMetaFieldDef.name) {
      schemaFieldDef = SchemaMetaFieldDef;
    } else if (isQueryType && fieldName === TypeMetaFieldDef.name) {
      schemaFieldDef = TypeMetaFieldDef;
    } else if (hasTypeName && fieldName === TypeNameMetaFieldDef.name) {
      schemaFieldDef = TypeNameMetaFieldDef;
    } else if (type instanceof GraphQLInterfaceType || type instanceof GraphQLObjectType) {
      schemaFieldDef = type.getFields()[fieldName];
    }
    return schemaFieldDef;
  };

  GraphQLParser.prototype._getErrorContext = function _getErrorContext() {
    var message = 'document `' + getName(this._definition) + '`';
    if (this._definition.loc && this._definition.loc.source) {
      message += ' file: `' + this._definition.loc.source.name + '`';
    }
    return message;
  };

  GraphQLParser.prototype._recordVariableReference = function _recordVariableReference(name, type) {
    var prevType = this._referencedVariables[name];
    if (type && prevType) {
      require('fbjs/lib/invariant')(this._referencedVariables[name] == null || isTypeSubTypeOf(this._schema, this._referencedVariables[name], type), 'GraphQLParser: Variable `$%s` was used in locations expecting ' + 'the conflicting types `%s` and `%s`. Source: %s.', name, prevType, type, this._getErrorContext());
    }
    this._referencedVariables[name] = prevType || type;
  };

  GraphQLParser.prototype.transform = function transform() {
    switch (this._definition.kind) {
      case 'OperationDefinition':
        return this._transformOperation(this._definition);
      case 'FragmentDefinition':
        return this._transformFragment(this._definition);
      default:
        require('fbjs/lib/invariant')(false, 'GraphQLParser: Unknown AST kind `%s`. Source: %s.', this._definition.kind, this._getErrorContext());
    }
  };

  GraphQLParser.prototype._transformFragment = function _transformFragment(fragment) {
    var _this2 = this;

    var argumentDefinitions = this._buildArgumentDefinitions(fragment);
    var directives = this._transformDirectives((fragment.directives || []).filter(function (directive) {
      return getName(directive) !== ARGUMENT_DEFINITIONS;
    }));
    var type = assertCompositeType(getTypeFromAST(this._schema, fragment.typeCondition));
    var selections = this._transformSelections(fragment.selectionSet, type);

    var _loop = function _loop(_name) {
      if (_this2._referencedVariables.hasOwnProperty(_name)) {
        var variableType = _this2._referencedVariables[_name];
        var localArgument = argumentDefinitions.find(function (argDef) {
          return argDef.name === _name;
        });
        if (localArgument) {
          require('fbjs/lib/invariant')(variableType == null || isTypeSubTypeOf(_this2._schema, localArgument.type, variableType), 'GraphQLParser: Variable `$%s` was defined as type `%s`, but used ' + 'in a location that expects type `%s`. Source: %s.', _name, localArgument.type, variableType, _this2._getErrorContext());
        } else {
          argumentDefinitions.push({
            kind: 'RootArgumentDefinition',
            metadata: null,
            name: _name,
            // $FlowFixMe - could be null
            type: variableType
          });
        }
      }
    };

    for (var _name in this._referencedVariables) {
      _loop(_name);
    }
    return {
      kind: 'Fragment',
      directives: directives,
      metadata: null,
      name: getName(fragment),
      selections: selections,
      type: type,
      argumentDefinitions: argumentDefinitions
    };
  };

  /**
   * Polyfills suport for fragment variable definitions via the
   * @argumentDefinitions directive. Returns the equivalent AST
   * to the `argumentDefinitions` property on queries/mutations/etc.
   */


  GraphQLParser.prototype._buildArgumentDefinitions = function _buildArgumentDefinitions(fragment) {
    var _this3 = this;

    var variableDirectives = (fragment.directives || []).filter(function (directive) {
      return getName(directive) === ARGUMENT_DEFINITIONS;
    });
    if (!variableDirectives.length) {
      return [];
    }
    require('fbjs/lib/invariant')(variableDirectives.length === 1, 'GraphQLParser: Directive %s may be defined at most once on fragment ' + '`%s`. Source: %s.', ARGUMENT_DEFINITIONS, getName(fragment), this._getErrorContext());
    var variableDirective = variableDirectives[0];
    // $FlowIssue: refining directly on `variableDirective.arguments` doesn't
    // work, below accesses all report arguments could still be null/undefined.
    var args = variableDirective.arguments;
    if (variableDirective == null || !Array.isArray(args)) {
      return [];
    }
    require('fbjs/lib/invariant')(args.length, 'GraphQLParser: Directive %s requires arguments: remove the directive ' + 'to skip defining local variables for this fragment `%s`. Source: %s.', ARGUMENT_DEFINITIONS, getName(fragment), this._getErrorContext());
    return args.map(function (arg) {
      var argName = getName(arg);
      var argValue = _this3._transformValue(arg.value);
      require('fbjs/lib/invariant')(argValue.kind === 'Literal', 'GraphQLParser: Expected definition for variable `%s` to be an ' + 'object with the following shape: `{type: string, defaultValue?: ' + 'mixed}`, got `%s`. Source: %s.', argValue, _this3._getErrorContext());
      var value = argValue.value;
      require('fbjs/lib/invariant')(!Array.isArray(value) && typeof value === 'object' && value !== null && typeof value.type === 'string', 'GraphQLParser: Expected definition for variable `%s` to be an ' + 'object with the following shape: `{type: string, defaultValue?: ' + 'mixed, nonNull?: boolean, list?: boolean}`, got `%s`. Source: %s.', argName, argValue, _this3._getErrorContext());

      var valueType = value.type;

      var unknownKeys = Object.keys(value).filter(function (key) {
        return key !== 'type' && key !== 'defaultValue' && key !== 'nonNull' && key !== 'list';
      });
      require('fbjs/lib/invariant')(unknownKeys.length === 0, 'GraphQLParser: Expected definition for variable `%s` to be an ' + 'object with the following shape: `{type: string, defaultValue?: ' + 'mixed, nonNull?: boolean, list?: boolean}`, got unknown key(s) ' + '`%s`. Source: %s.', argName, unknownKeys.join('`, `'), _this3._getErrorContext());

      var typeAST = parseType(valueType);
      var type = assertInputType(getTypeFromAST(_this3._schema, typeAST));
      return {
        kind: 'LocalArgumentDefinition',
        defaultValue: value.defaultValue != null ? value.defaultValue : null,
        metadata: null,
        name: argName,
        type: type
      };
    });
  };

  GraphQLParser.prototype._transformOperation = function _transformOperation(definition) {
    var name = getName(definition);
    var argumentDefinitions = this._transformArgumentDefinitions(definition.variableDefinitions || []);
    var directives = this._transformDirectives(definition.directives || []);
    var type = void 0;
    var operation = void 0;
    switch (definition.operation) {
      case 'query':
        operation = 'query';
        type = assertCompositeType(this._schema.getQueryType());
        break;
      case 'mutation':
        operation = 'mutation';
        type = assertCompositeType(this._schema.getMutationType());
        break;
      case 'subscription':
        operation = 'subscription';
        type = assertCompositeType(this._schema.getSubscriptionType());
        break;
      default:
        require('fbjs/lib/invariant')(false, 'GraphQLParser: Unknown AST kind `%s`. Source: %s.', definition.operation, this._getErrorContext());
    }
    require('fbjs/lib/invariant')(definition.selectionSet, 'GraphQLParser: Expected %s `%s` to have selections. Source: %s.', operation, name, this._getErrorContext());
    var selections = this._transformSelections(definition.selectionSet, type);
    return {
      kind: 'Root',
      operation: operation,
      metadata: null,
      name: name,
      argumentDefinitions: argumentDefinitions,
      directives: directives,
      selections: selections,
      type: type
    };
  };

  GraphQLParser.prototype._transformArgumentDefinitions = function _transformArgumentDefinitions(argumentDefinitions) {
    var _this4 = this;

    return argumentDefinitions.map(function (def) {
      var name = getName(def.variable);
      var type = assertInputType(getTypeFromAST(_this4._schema, def.type));
      var defaultLiteral = def.defaultValue ? _this4._transformValue(def.defaultValue) : null;
      require('fbjs/lib/invariant')(defaultLiteral === null || defaultLiteral.kind === 'Literal', 'GraphQLParser: Expected null or Literal default value, got: `%s`. ' + 'Source: %s.', defaultLiteral && defaultLiteral.kind, _this4._getErrorContext());
      return {
        kind: 'LocalArgumentDefinition',
        metadata: null,
        name: name,
        defaultValue: defaultLiteral ? defaultLiteral.value : null,
        type: type
      };
    });
  };

  GraphQLParser.prototype._transformSelections = function _transformSelections(selectionSet, parentType) {
    var _this5 = this;

    return selectionSet.selections.map(function (selection) {
      var node = void 0;
      if (selection.kind === 'Field') {
        node = _this5._transformField(selection, parentType);
      } else if (selection.kind === 'FragmentSpread') {
        node = _this5._transformFragmentSpread(selection, parentType);
      } else if (selection.kind === 'InlineFragment') {
        node = _this5._transformInlineFragment(selection, parentType);
      } else {
        require('fbjs/lib/invariant')(false, 'GraphQLParser: Unexpected AST kind `%s`. Source: %s.', selection.kind, _this5._getErrorContext());
      }

      var _splitConditions2 = _this5._splitConditions(node.directives),
          conditions = _splitConditions2[0],
          directives = _splitConditions2[1];

      var conditionalNodes = applyConditions(conditions,
      // $FlowFixMe(>=0.28.0)
      [(0, _extends3['default'])({}, node, { directives: directives })]);
      require('fbjs/lib/invariant')(conditionalNodes.length === 1, 'GraphQLParser: Expected exactly one conditional node, got `%s`. ' + 'Source: %s.', conditionalNodes.length, _this5._getErrorContext());
      return conditionalNodes[0];
    });
  };

  GraphQLParser.prototype._transformInlineFragment = function _transformInlineFragment(fragment, parentType) {
    var typeCondition = assertCompositeType(fragment.typeCondition ? getTypeFromAST(this._schema, fragment.typeCondition) : parentType);
    var directives = this._transformDirectives(fragment.directives || []);
    var selections = this._transformSelections(fragment.selectionSet, typeCondition);
    return {
      kind: 'InlineFragment',
      directives: directives,
      metadata: null,
      selections: selections,
      typeCondition: typeCondition
    };
  };

  GraphQLParser.prototype._transformFragmentSpread = function _transformFragmentSpread(fragment, parentType) {
    var _this6 = this;

    var fragmentName = getName(fragment);

    var _partitionArray = require('fbjs/lib/partitionArray')(fragment.directives || [], function (directive) {
      return getName(directive) !== ARGUMENTS;
    }),
        otherDirectives = _partitionArray[0],
        argumentDirectives = _partitionArray[1];

    require('fbjs/lib/invariant')(argumentDirectives.length <= 1, 'GraphQLParser: Directive %s may be used at most once in fragment ' + 'spread `...%s`. Source: %s.', ARGUMENTS, fragmentName, this._getErrorContext());
    var args = void 0;
    if (argumentDirectives.length) {
      args = (argumentDirectives[0].arguments || []).map(function (arg) {
        var argValue = arg.value;
        require('fbjs/lib/invariant')(argValue.kind === 'Variable', 'GraphQLParser: All @arguments() args must be variables, got %s. ' + 'Source: %s.', argValue.kind, _this6._getErrorContext());

        return {
          kind: 'Argument',
          metadata: null,
          name: getName(arg),
          value: _this6._transformVariable(argValue),
          type: null // TODO: can't get type until referenced fragment is defined
        };
      });
    }
    var directives = this._transformDirectives(otherDirectives);
    return {
      kind: 'FragmentSpread',
      args: args || [],
      metadata: null,
      name: fragmentName,
      directives: directives
    };
  };

  GraphQLParser.prototype._transformField = function _transformField(field, parentType) {
    var name = getName(field);
    var fieldDef = this.getFieldDefinition(parentType, name, field);
    require('fbjs/lib/invariant')(fieldDef, 'GraphQLParser: Unknown field `%s` on type `%s`. Source: %s.', name, parentType, this._getErrorContext());
    var alias = field.alias ? field.alias.value : null;
    var args = this._transformArguments(field.arguments || [], fieldDef.args);

    var _partitionArray2 = require('fbjs/lib/partitionArray')(field.directives || [], function (directive) {
      return getName(directive) !== CLIENT_FIELD;
    }),
        otherDirectives = _partitionArray2[0],
        clientFieldDirectives = _partitionArray2[1];

    var directives = this._transformDirectives(otherDirectives);
    var type = assertOutputType(fieldDef.type);
    var handles = this._transformHandle(name, args, clientFieldDirectives);
    if (isLeafType(getNamedType(type))) {
      require('fbjs/lib/invariant')(!field.selectionSet || !field.selectionSet.selections || !field.selectionSet.selections.length, 'GraphQLParser: Expected no selections for scalar field `%s` on type ' + '`%s`. Source: %s.', name, this._getErrorContext());
      return {
        kind: 'ScalarField',
        alias: alias,
        args: args,
        directives: directives,
        handles: handles,
        metadata: null,
        name: name,
        type: assertScalarFieldType(type)
      };
    } else {
      var selections = field.selectionSet ? this._transformSelections(field.selectionSet, type) : null;
      require('fbjs/lib/invariant')(selections && selections.length, 'GraphQLParser: Expected at least one selection for non-scalar field ' + '`%s` on type `%s`. Source: %s.', name, type, this._getErrorContext());
      return {
        kind: 'LinkedField',
        alias: alias,
        args: args,
        directives: directives,
        handles: handles,
        metadata: null,
        name: name,
        selections: selections,
        type: type
      };
    }
  };

  GraphQLParser.prototype._transformHandle = function _transformHandle(fieldName, fieldArgs, clientFieldDirectives) {
    var _this7 = this;

    var handles = void 0;
    clientFieldDirectives.forEach(function (clientFieldDirective) {
      var handleArgument = (clientFieldDirective.arguments || []).find(function (arg) {
        return getName(arg) === CLIENT_FIELD_HANDLE;
      });
      if (handleArgument) {
        var _name2 = null;
        var key = DEFAULT_HANDLE_KEY;
        var filters = null;
        var maybeHandle = _this7._transformValue(handleArgument.value);
        require('fbjs/lib/invariant')(maybeHandle.kind === 'Literal' && typeof maybeHandle.value === 'string', 'GraphQLParser: Expected the %s argument to @%s to be a literal ' + 'string, got `%s` on field `%s`. Source: %s.', CLIENT_FIELD_HANDLE, CLIENT_FIELD, maybeHandle, fieldName, _this7._getErrorContext());
        _name2 = maybeHandle.value;

        var keyArgument = (clientFieldDirective.arguments || []).find(function (arg) {
          return getName(arg) === CLIENT_FIELD_KEY;
        });
        if (keyArgument) {
          var maybeKey = _this7._transformValue(keyArgument.value);
          require('fbjs/lib/invariant')(maybeKey.kind === 'Literal' && typeof maybeKey.value === 'string', 'GraphQLParser: Expected %s argument to @%s to be a literal ' + 'string, got `%s` on field `%s`. Source: %s.', CLIENT_FIELD_KEY, CLIENT_FIELD, maybeKey, fieldName, _this7._getErrorContext());
          key = maybeKey.value;
        }
        var filtersArgument = (clientFieldDirective.arguments || []).find(function (arg) {
          return getName(arg) === CLIENT_FIELD_FILTERS;
        });
        if (filtersArgument) {
          var maybeFilters = _this7._transformValue(filtersArgument.value);
          require('fbjs/lib/invariant')(maybeFilters.kind === 'Literal' && Array.isArray(maybeFilters.value) && maybeFilters.value.every(function (filter) {
            return fieldArgs.some(function (fieldArg) {
              return fieldArg.name === filter;
            });
          }), 'GraphQLParser: Expected %s argument to @%s to be an array of ' + 'argument names on field `%s`, but get %s. Source: %s.', CLIENT_FIELD_FILTERS, CLIENT_FIELD, fieldName, maybeFilters, _this7._getErrorContext());
          // $FlowFixMe
          filters = maybeFilters.value;
        }
        handles = handles || [];
        handles.push({ name: _name2, key: key, filters: filters });
      }
    });
    return handles;
  };

  GraphQLParser.prototype._transformDirectives = function _transformDirectives(directives) {
    var _this8 = this;

    return directives.map(function (directive) {
      var name = getName(directive);
      var directiveDef = _this8._schema.getDirective(name);
      require('fbjs/lib/invariant')(directiveDef, 'GraphQLParser: Unknown directive `@%s`. Source: %s.', name, _this8._getErrorContext());
      var args = _this8._transformArguments(directive.arguments || [], directiveDef.args);
      return {
        kind: 'Directive',
        metadata: null,
        name: name,
        args: args
      };
    });
  };

  GraphQLParser.prototype._transformArguments = function _transformArguments(args, argumentDefinitions) {
    var _this9 = this;

    return args.map(function (arg) {
      var argName = getName(arg);
      var argDef = argumentDefinitions.find(function (def) {
        return def.name === argName;
      });
      require('fbjs/lib/invariant')(argDef, 'GraphQLParser: Unknown argument `%s`. Source: %s.', argName, _this9._getErrorContext());
      var value = _this9._transformValue(arg.value, argDef.type);
      return {
        kind: 'Argument',
        metadata: null,
        name: argName,
        value: value,
        type: argDef.type
      };
    });
  };

  GraphQLParser.prototype._splitConditions = function _splitConditions(mixedDirectives) {
    var _this10 = this;

    var conditions = [];
    var directives = [];
    mixedDirectives.forEach(function (directive) {
      if (directive.name === INCLUDE || directive.name === SKIP) {
        var passingValue = directive.name === INCLUDE;
        var arg = directive.args[0];
        require('fbjs/lib/invariant')(arg && arg.name === IF, 'GraphQLParser: Expected an `if` argument to @%s. Source: %s.', directive.name, _this10._getErrorContext());
        require('fbjs/lib/invariant')(arg.value.kind === 'Variable' || arg.value.kind === 'Literal', 'GraphQLParser: Expected the `if` argument to @%s to be a variable. ' + 'Source: %s.', directive.name, _this10._getErrorContext());
        conditions.push({
          kind: 'Condition',
          condition: arg.value,
          metadata: null,
          passingValue: passingValue,
          selections: []
        });
      } else {
        directives.push(directive);
      }
    });
    var sortedConditions = [].concat(conditions).sort(function (a, b) {
      if (a.condition.kind === 'Variable' && b.condition.kind === 'Variable') {
        return a.condition.variableName < b.condition.variableName ? -1 : a.condition.variableName > b.condition.variableName ? 1 : 0;
      } else {
        // sort literals earlier, variables later
        return a.condition.kind === 'Variable' ? 1 : b.condition.kind === 'Variable' ? -1 : 0;
      }
    });
    return [sortedConditions, directives];
  };

  GraphQLParser.prototype._transformVariable = function _transformVariable(ast, type) {
    var variableName = getName(ast);
    this._recordVariableReference(variableName, type);
    return {
      kind: 'Variable',
      metadata: null,
      variableName: variableName
    };
  };

  /**
   * Transforms AST values into IR values, extracting the literal JS values of any
   * subtree of the AST that does not contain a variable.
   */


  GraphQLParser.prototype._transformValue = function _transformValue(ast, type) {
    var _this11 = this;

    switch (ast.kind) {
      case 'IntValue':
        return {
          kind: 'Literal',
          metadata: null,
          value: parseInt(ast.value, 10)
        };
      case 'FloatValue':
        return {
          kind: 'Literal',
          metadata: null,
          value: parseFloat(ast.value)
        };
      case 'StringValue':
      case 'BooleanValue':
      case 'EnumValue':
        return {
          kind: 'Literal',
          metadata: null,
          value: ast.value
        };
      case 'ListValue':
        var itemType = void 0;
        if (type) {
          var listType = getNullableType(type);
          // The user entered a list, a `type` was expected; this is only valid
          // if `type` is a List.
          require('fbjs/lib/invariant')(listType instanceof GraphQLList, 'GraphQLParser: Expected a value matching type `%s`, but ' + 'got a list value. Source: %s.', type, this._getErrorContext());
          itemType = assertInputType(listType.ofType);
        }
        var literalList = [];
        var items = [];
        var areAllItemsScalar = true;
        ast.values.forEach(function (item) {
          var itemValue = _this11._transformValue(item, itemType);
          if (itemValue.kind === 'Literal') {
            literalList.push(itemValue.value);
          }
          items.push(itemValue);
          areAllItemsScalar = areAllItemsScalar && itemValue.kind === 'Literal';
        });
        if (areAllItemsScalar) {
          return {
            kind: 'Literal',
            metadata: null,
            value: literalList
          };
        } else {
          return {
            kind: 'ListValue',
            metadata: null,
            items: items
          };
        }
      case 'NullValue':
        return {
          kind: 'Literal',
          metadata: null,
          value: null
        };
      case 'ObjectValue':
        var literalObject = {};
        var fields = [];
        var areAllFieldsScalar = true;
        ast.fields.forEach(function (field) {
          var fieldName = getName(field);
          var fieldType = void 0;
          if (type) {
            var objectType = getNullableType(type);
            // The user entered an object, a `type` was expected; this is only
            // valid if `type` is an Object.
            require('fbjs/lib/invariant')(objectType instanceof GraphQLInputObjectType, 'GraphQLParser: Expected a value matching type `%s`, but ' + 'got an object value. Source: %s.', type, _this11._getErrorContext());
            var fieldConfig = objectType.getFields()[fieldName];
            require('fbjs/lib/invariant')(fieldConfig, 'GraphQLParser: Unknown field `%s` on type `%s`. Source: %s.', fieldName, type, _this11._getErrorContext());
            fieldType = assertInputType(fieldConfig.type);
          }
          var fieldValue = _this11._transformValue(field.value, fieldType);
          if (fieldValue.kind === 'Literal') {
            literalObject[field.name.value] = fieldValue.value;
          }
          fields.push({
            kind: 'ObjectFieldValue',
            metadata: null,
            name: fieldName,
            value: fieldValue
          });
          areAllFieldsScalar = areAllFieldsScalar && fieldValue.kind === 'Literal';
        });
        if (areAllFieldsScalar) {
          return {
            kind: 'Literal',
            metadata: null,
            value: literalObject
          };
        } else {
          return {
            kind: 'ObjectValue',
            metadata: null,
            fields: fields
          };
        }
      case 'Variable':
        return this._transformVariable(ast, type);
      // eslint-disable: no-fallthrough
      default:
        require('fbjs/lib/invariant')(false, 'GraphQLParser: Unknown ast kind: %s. Source: %s.', ast.kind, this._getErrorContext());
      // eslint-enable
    }
  };

  return GraphQLParser;
}();

function isScalarFieldType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType;
}

function assertScalarFieldType(type) {
  require('fbjs/lib/invariant')(isScalarFieldType(type), 'Expected %s to be a Scalar Field type.', type);
  return type;
}

function applyConditions(conditions, selections) {
  var nextSelections = selections;
  conditions.forEach(function (condition) {
    nextSelections = [(0, _extends3['default'])({}, condition, {
      selections: nextSelections
    })];
  });
  return nextSelections;
}

function getName(ast) {
  var name = ast.name ? ast.name.value : null;
  require('fbjs/lib/invariant')(typeof name === 'string', 'GraphQLParser: Expected ast node `%s` to have a name.', ast);
  return name;
}

module.exports = GraphQLParser;