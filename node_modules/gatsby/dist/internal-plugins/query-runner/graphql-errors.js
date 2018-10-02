"use strict";

exports.__esModule = true;
exports.multipleRootQueriesError = multipleRootQueriesError;
exports.graphqlValidationError = graphqlValidationError;
exports.graphqlError = graphqlError;

var _graphql = require("graphql");

var _babelCodeFrame = require("babel-code-frame");

var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reporter = require("gatsby-cli/lib/reporter");

var _reporter2 = _interopRequireDefault(_reporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// These handle specific errors throw by RelayParser. If an error matches
// you get a pointer to the location in the query that is broken, otherwise
// we show the error and the query.
var handlers = [[/Unknown field `(.+)` on type `(.+)`/i, function (_ref, node) {
  var name = _ref[0];

  if (node.kind === `Field` && node.name.value === name) {
    return node.name.loc;
  }
  return null;
}], [/Unknown argument `(.+)`/i, function (_ref2, node) {
  var name = _ref2[0];

  if (node.kind === `Argument` && node.name.value === name) {
    return node.name.loc;
  }
  return null;
}], [/Unknown directive `@(.+)`/i, function (_ref3, node) {
  var name = _ref3[0];

  if (node.kind === `Directive` && node.name.value === name) {
    return node.name.loc;
  }
  return null;
}]];

function formatFilePath(filePath) {
  return `${_reporter2.default.format.bold(`file:`)} ${_reporter2.default.format.blue(filePath)}`;
}

function formatError(message, filePath, codeFrame) {
  return _reporter2.default.stripIndent`
    ${message}

      ${formatFilePath(filePath)}
  ` + `\n\n${codeFrame}\n`;
}

function extractError(error) {
  var docRegex = /Invariant Violation: (RelayParser|GraphQLParser): (.*). Source: document `(.*)` file:/g;
  var matches = void 0;
  var message = ``,
      docName = ``;
  while ((matches = docRegex.exec(error.toString())) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === docRegex.lastIndex) docRegex.lastIndex++;var _matches = matches;
    message = _matches[2];
    docName = _matches[3];
  }

  if (!message) {
    message = error.toString();
  }

  return { message, docName };
}

function findLocation(extractedMessage, def) {
  var location = null;
  (0, _graphql.visit)(def, {
    enter(node) {
      if (location) return;
      for (var _iterator = handlers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref5 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref5 = _i.value;
        }

        var _ref4 = _ref5;
        var regex = _ref4[0];
        var handler = _ref4[1];

        var match = extractedMessage.match(regex);
        if (!match) continue;
        if (location = handler(match.slice(1), node)) break;
      }
    }
  });
  return location;
}

function getCodeFrame(query, lineNumber, column) {
  return (0, _babelCodeFrame2.default)(query, lineNumber, column, {
    linesAbove: 10,
    linesBelow: 10
  });
}

function getCodeFrameFromRelayError(def, extractedMessage, error) {
  var _ref6 = findLocation(extractedMessage, def) || {},
      start = _ref6.start,
      source = _ref6.source;

  var query = source ? source.body : (0, _graphql.print)(def);

  // we can't reliably get a location without the location source, since
  // the printed query may differ from the original.

  var _ref7 = source && (0, _graphql.getLocation)(source, start) || {},
      line = _ref7.line,
      column = _ref7.column;

  return getCodeFrame(query, line, column);
}

function multipleRootQueriesError(filePath, def, otherDef) {
  var name = def.name.value;
  var otherName = otherDef.name.value;
  var unifiedName = `${_lodash2.default.camelCase(name)}And${_lodash2.default.upperFirst(_lodash2.default.camelCase(otherName))}`;

  return formatError(`Multiple "root" queries found in file: "${name}" and "${otherName}". ` + `Only the first ("${otherName}") will be registered.`, filePath, `  ${_reporter2.default.format.yellow(`Instead of:`)} \n\n` + (0, _babelCodeFrame2.default)(_reporter2.default.stripIndent`
      query ${otherName} {
        bar {
          #...
        }
      }

      query ${name} {
        foo {
          #...
        }
      }
    `) + `\n\n  ${_reporter2.default.format.green(`Do:`)} \n\n` + (0, _babelCodeFrame2.default)(_reporter2.default.stripIndent`
      query ${unifiedName} {
        bar {
          #...
        }
        foo {
          #...
        }
      }
    `));
}

function graphqlValidationError(errors, filePath, doc) {
  if (!errors || !errors.length) return ``;
  var error = errors[0];
  var source = error.source,
      _error$locations = error.locations;
  _error$locations = _error$locations === undefined ? [{}] : _error$locations;
  var _error$locations$ = _error$locations[0],
      line = _error$locations$.line,
      column = _error$locations$.column;

  var query = source ? source.body : (0, _graphql.print)(doc);

  return formatError(error.message, filePath, getCodeFrame(query, line, column));
}

function graphqlError(namePathMap, nameDefMap, error) {
  var _extractError = extractError(error),
      message = _extractError.message,
      docName = _extractError.docName;

  var filePath = namePathMap.get(docName);

  if (filePath && docName) {
    return formatError(message, filePath, getCodeFrameFromRelayError(nameDefMap.get(docName), message, error));
  }

  var reportedMessage = `There was an error while compiling your site's GraphQL queries.
  ${message || error.message}
    `;

  if (error.message.match(/must be an instance of/)) {
    reportedMessage += `This usually means that more than one instance of 'graphql' is installed ` + `in your node_modules. Remove all but the top level one or run \`npm dedupe\` to fix it.`;
  }

  if (error.message.match(/Duplicate document/)) {
    reportedMessage += `${error.message.slice(21)}\n`;
  }

  return reportedMessage;
}
//# sourceMappingURL=graphql-errors.js.map