"use strict";

exports.__esModule = true;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

exports.inferInputObjectStructureFromFields = inferInputObjectStructureFromFields;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require(`graphql`),
    GraphQLInputObjectType = _require.GraphQLInputObjectType,
    GraphQLBoolean = _require.GraphQLBoolean,
    GraphQLString = _require.GraphQLString,
    GraphQLFloat = _require.GraphQLFloat,
    GraphQLInt = _require.GraphQLInt,
    GraphQLID = _require.GraphQLID,
    GraphQLList = _require.GraphQLList,
    GraphQLEnumType = _require.GraphQLEnumType,
    GraphQLNonNull = _require.GraphQLNonNull,
    GraphQLScalarType = _require.GraphQLScalarType,
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLInterfaceType = _require.GraphQLInterfaceType,
    GraphQLUnionType = _require.GraphQLUnionType;

var _ = require(`lodash`);
var report = require(`gatsby-cli/lib/reporter`);
var createTypeName = require(`./create-type-name`);
var createKey = require(`./create-key`);

function makeNullable(type) {
  if (type instanceof GraphQLNonNull) {
    return type.ofType;
  }
  return type;
}

function convertToInputType(type, typeMap) {
  // track types already processed in current tree, to avoid infinite recursion
  if (typeMap.has(type)) {
    return null;
  }
  var nextTypeMap = new Set(Array.from(typeMap).concat([type]));

  if (type instanceof GraphQLScalarType || type instanceof GraphQLEnumType) {
    return type;
  } else if (type instanceof GraphQLObjectType) {
    var fields = _.transform(type.getFields(), function (out, fieldConfig, key) {
      var type = convertToInputType(fieldConfig.type, nextTypeMap);
      if (type) out[key] = { type };
    });
    if (Object.keys(fields).length === 0) {
      return null;
    }
    return new GraphQLInputObjectType({
      name: createTypeName(`${type.name}InputObject`),
      fields
    });
  } else if (type instanceof GraphQLList) {
    var innerType = convertToInputType(type.ofType, nextTypeMap);
    return innerType ? new GraphQLList(makeNullable(innerType)) : null;
  } else if (type instanceof GraphQLNonNull) {
    var _innerType = convertToInputType(type.ofType, nextTypeMap);
    return _innerType ? new GraphQLNonNull(makeNullable(_innerType)) : null;
  } else {
    var message = type ? `for type: ${type.name}` : ``;
    if (type instanceof GraphQLInterfaceType) {
      message = `GraphQLInterfaceType not yet implemented ${message}`;
    } else if (type instanceof GraphQLUnionType) {
      message = `GraphQLUnionType not yet implemented ${message}`;
    } else {
      message = `Invalid input type ${message}`;
    }
    report.verbose(message);
  }

  return null;
}

var scalarFilterMap = {
  Int: {
    eq: { type: GraphQLInt },
    ne: { type: GraphQLInt },
    gt: { type: GraphQLInt },
    gte: { type: GraphQLInt },
    lt: { type: GraphQLInt },
    lte: { type: GraphQLInt }
  },
  Float: {
    eq: { type: GraphQLFloat },
    ne: { type: GraphQLFloat },
    gt: { type: GraphQLFloat },
    gte: { type: GraphQLFloat },
    lt: { type: GraphQLFloat },
    lte: { type: GraphQLFloat }
  },
  ID: {
    eq: { type: GraphQLID },
    ne: { type: GraphQLID }
  },
  String: {
    eq: { type: GraphQLString },
    ne: { type: GraphQLString },
    regex: { type: GraphQLString },
    glob: { type: GraphQLString }
  },
  Boolean: {
    eq: { type: GraphQLBoolean },
    ne: { type: GraphQLBoolean }
  }
};

function convertToInputFilter(prefix, type) {
  if (type instanceof GraphQLScalarType) {
    var name = type.name;
    var fields = scalarFilterMap[name];

    if (fields == null) return null;
    return new GraphQLInputObjectType({
      name: createTypeName(`${prefix}Query${name}`),
      fields: fields
    });
  } else if (type instanceof GraphQLInputObjectType) {
    return new GraphQLInputObjectType({
      name: createTypeName(`${prefix}{type.name}`),
      fields: _.transform(type.getFields(), function (out, fieldConfig, key) {
        var type = convertToInputFilter(`${prefix}${_.upperFirst(key)}`, fieldConfig.type);
        if (type) out[key] = { type };
      })
    });
  } else if (type instanceof GraphQLList) {
    var innerType = type.ofType;
    var innerFilter = convertToInputFilter(`${prefix}ListElem`, innerType);
    var innerFields = innerFilter ? innerFilter.getFields() : {};

    return new GraphQLInputObjectType({
      name: createTypeName(`${prefix}QueryList`),
      fields: (0, _extends3.default)({}, innerFields, {
        in: { type: new GraphQLList(innerType) }
      })
    });
  } else if (type instanceof GraphQLNonNull) {
    return convertToInputFilter(prefix, type.ofType);
  }

  return null;
}

function extractFieldNamesFromInputField(prefix, type, accu) {
  if (type instanceof GraphQLScalarType || type instanceof GraphQLList) {
    accu.push(prefix);
  } else if (type instanceof GraphQLInputObjectType) {
    _.each(type.getFields(), function (fieldConfig, key) {
      extractFieldNamesFromInputField(`${prefix}___${key}`, fieldConfig.type, accu);
    });
  } else if (type instanceof GraphQLNonNull) {
    extractFieldNamesFromInputField(prefix, type.ofType, accu);
  }
}

// convert output fields to output fields and a list of fields to sort on
function inferInputObjectStructureFromFields(_ref) {
  var fields = _ref.fields,
      _ref$typeName = _ref.typeName,
      typeName = _ref$typeName === undefined ? `` : _ref$typeName;

  var inferredFields = {};
  var sort = [];

  _.each(fields, function (fieldConfig, key) {
    var inputType = convertToInputType(fieldConfig.type, new Set());
    var inputFilter = inputType && convertToInputFilter(_.upperFirst(key), inputType);

    if (!inputFilter) return;

    inferredFields[createKey(key)] = { type: inputFilter

      // Add sorting (but only to the top level).
    };if (typeName) {
      extractFieldNamesFromInputField(key, inputType, sort);
    }
  });

  return { inferredFields, sort };
}
//# sourceMappingURL=infer-graphql-input-fields-from-fields.js.map