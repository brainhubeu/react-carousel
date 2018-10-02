/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayFlowTypeTransformers
 * 
 * @format
 */

'use strict';

var _require = require('./RelayFlowBabelFactories'),
    readOnlyArrayOfType = _require.readOnlyArrayOfType,
    stringLiteralTypeAnnotation = _require.stringLiteralTypeAnnotation;

var _require2 = require('graphql'),
    GraphQLEnumType = _require2.GraphQLEnumType,
    GraphQLInputType = _require2.GraphQLInputType,
    GraphQLInputObjectType = _require2.GraphQLInputObjectType,
    GraphQLInterfaceType = _require2.GraphQLInterfaceType,
    GraphQLList = _require2.GraphQLList,
    GraphQLNonNull = _require2.GraphQLNonNull,
    GraphQLObjectType = _require2.GraphQLObjectType,
    GraphQLScalarType = _require2.GraphQLScalarType,
    GraphQLType = _require2.GraphQLType,
    GraphQLUnionType = _require2.GraphQLUnionType;

function transformScalarType(type, customScalars, objectProps) {
  if (type instanceof GraphQLNonNull) {
    return transformNonNullableScalarType(type.ofType, objectProps, customScalars);
  } else {
    return require('babel-types').nullableTypeAnnotation(transformNonNullableScalarType(type, objectProps, customScalars));
  }
}

function transformNonNullableScalarType(type, objectProps, customScalars) {
  if (type instanceof GraphQLList) {
    return readOnlyArrayOfType(transformScalarType(type.ofType, customScalars, objectProps));
  } else if (type instanceof GraphQLObjectType || type instanceof GraphQLUnionType || type instanceof GraphQLInterfaceType) {
    return objectProps;
  } else if (type instanceof GraphQLScalarType) {
    return transformGraphQLScalarType(type, customScalars);
  } else if (type instanceof GraphQLEnumType) {
    return transformGraphQLEnumType(type);
  } else {
    throw new Error('Could not convert from GraphQL type ' + type.toString());
  }
}

function transformGraphQLScalarType(type, customScalars) {
  switch (customScalars[type.name] || type.name) {
    case 'ID':
    case 'String':
    case 'Url':
      return require('babel-types').stringTypeAnnotation();
    case 'Float':
    case 'Int':
      return require('babel-types').numberTypeAnnotation();
    case 'Boolean':
      return require('babel-types').booleanTypeAnnotation();
    default:
      return require('babel-types').anyTypeAnnotation();
  }
}

function transformGraphQLEnumType(type) {
  // TODO create a flow type for enums
  return require('babel-types').unionTypeAnnotation(type.getValues().map(function (_ref) {
    var value = _ref.value;
    return stringLiteralTypeAnnotation(value);
  }));
}

function transformInputType(type, customScalars, inputFieldWhiteList) {
  if (type instanceof GraphQLNonNull) {
    return transformNonNullableInputType(type.ofType, customScalars, inputFieldWhiteList);
  } else {
    return require('babel-types').nullableTypeAnnotation(transformNonNullableInputType(type, customScalars, inputFieldWhiteList));
  }
}

function transformNonNullableInputType(type, customScalars, inputFieldWhiteList) {
  if (type instanceof GraphQLList) {
    return readOnlyArrayOfType(transformInputType(type.ofType, customScalars, inputFieldWhiteList));
  } else if (type instanceof GraphQLScalarType) {
    return transformGraphQLScalarType(type, customScalars);
  } else if (type instanceof GraphQLEnumType) {
    return transformGraphQLEnumType(type);
  } else if (type instanceof GraphQLInputObjectType) {
    var fields = type.getFields();
    var props = Object.keys(fields).map(function (key) {
      return fields[key];
    }).filter(function (field) {
      return !inputFieldWhiteList || inputFieldWhiteList.indexOf(field.name) < 0;
    }).map(function (field) {
      var property = require('babel-types').objectTypeProperty(require('babel-types').identifier(field.name), transformInputType(field.type, customScalars, inputFieldWhiteList));
      if (!(field.type instanceof GraphQLNonNull)) {
        property.optional = true;
      }
      return property;
    });
    return require('babel-types').objectTypeAnnotation(props);
  } else {
    throw new Error('Could not convert from GraphQL type ' + type.toString());
  }
}

module.exports = {
  transformInputType: transformInputType,
  transformScalarType: transformScalarType
};