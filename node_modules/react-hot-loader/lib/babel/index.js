'use strict';

var replaced = Symbol('replaced');

var buildNewClassProperty = function buildNewClassProperty(t, classPropertyName, newMethodName, isAsync) {
  var returnExpression = t.callExpression(t.memberExpression(t.thisExpression(), newMethodName), [t.spreadElement(t.identifier('params'))]);

  if (isAsync) {
    returnExpression = t.awaitExpression(returnExpression);
  }

  var newArrowFunction = t.arrowFunctionExpression([t.restElement(t.identifier('params'))], returnExpression, isAsync);
  return t.classProperty(classPropertyName, newArrowFunction);
};

var buildNewAssignmentExpression = function buildNewAssignmentExpression(t, classPropertyName, newMethodName, isAsync) {
  var returnExpression = t.callExpression(t.memberExpression(t.thisExpression(), newMethodName), [t.spreadElement(t.identifier('params'))]);

  if (isAsync) {
    returnExpression = t.awaitExpression(returnExpression);
  }

  var newArrowFunction = t.arrowFunctionExpression([t.restElement(t.identifier('params'))], returnExpression, isAsync);
  var left = t.memberExpression(t.thisExpression(), t.identifier(classPropertyName.name));

  var replacement = t.assignmentExpression('=', left, newArrowFunction);
  replacement[replaced] = true;

  return replacement;
};

var classPropertyOptOutVistor = {
  MetaProperty: function MetaProperty(path, state) {
    var node = path.node;


    if (node.meta.name === 'new' && node.property.name === 'target') {
      state.optOut = true; // eslint-disable-line no-param-reassign
    }
  },
  ReferencedIdentifier: function ReferencedIdentifier(path, state) {
    var node = path.node;


    if (node.name === 'arguments') {
      state.optOut = true; // eslint-disable-line no-param-reassign
    }
  }
};

module.exports = function plugin(args) {
  // This is a Babel plugin, but the user put it in the Webpack config.
  if (this && this.callback) {
    throw new Error('React Hot Loader: You are erroneously trying to use a Babel plugin ' + 'as a Webpack loader. We recommend that you use Babel, ' + 'remove "react-hot-loader/babel" from the "loaders" section ' + 'of your Webpack configuration, and instead add ' + '"react-hot-loader/babel" to the "plugins" section of your .babelrc file. ' + 'If you prefer not to use Babel, replace "react-hot-loader/babel" with ' + '"react-hot-loader/webpack" in the "loaders" section of your Webpack configuration. ');
  }
  var t = args.types,
      template = args.template;


  var templateOptions = {
    placeholderPattern: /^([A-Z0-9]+)([A-Z0-9_]+)$/
  };

  var buildRegistration = template('__REACT_HOT_LOADER__.register(ID, NAME, FILENAME);', templateOptions);

  // We're making the IIFE we insert at the end of the file an unused variable
  // because it otherwise breaks the output of the babel-node REPL (#359).
  var buildTagger = template('\n  var UNUSED = (function () {\n    if (typeof __REACT_HOT_LOADER__ === \'undefined\') {\n      return;\n    }\n\n    REGISTRATIONS\n  })();\n  ', templateOptions);

  // No-op in production.
  if (process.env.NODE_ENV === 'production') {
    return { visitor: {} };
  }

  // Gather top-level variables, functions, and classes.
  // Try our best to avoid variables from require().
  // Ideally we only want to find components defined by the user.
  function shouldRegisterBinding(binding) {
    var _binding$path = binding.path,
        type = _binding$path.type,
        node = _binding$path.node;

    switch (type) {
      case 'FunctionDeclaration':
      case 'ClassDeclaration':
      case 'VariableDeclaration':
        return true;
      case 'VariableDeclarator':
        {
          var init = node.init;

          if (t.isCallExpression(init) && init.callee.name === 'require') {
            return false;
          }
          return true;
        }
      default:
        return false;
    }
  }

  var REGISTRATIONS = Symbol('registrations');
  return {
    visitor: {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path, _ref) {
        var file = _ref.file;

        // Default exports with names are going
        // to be in scope anyway so no need to bother.
        if (path.node.declaration.id) {
          return;
        }

        // Move export default right hand side to a variable
        // so we can later refer to it and tag it with __source.
        var id = path.scope.generateUidIdentifier('default');
        var expression = t.isExpression(path.node.declaration) ? path.node.declaration : t.toExpression(path.node.declaration);
        path.insertBefore(t.variableDeclaration('const', [t.variableDeclarator(id, expression)]));
        path.node.declaration = id; // eslint-disable-line no-param-reassign

        // It won't appear in scope.bindings
        // so we'll manually remember it exists.
        path.parent[REGISTRATIONS].push(buildRegistration({
          ID: id,
          NAME: t.stringLiteral('default'),
          FILENAME: t.stringLiteral(file.opts.filename)
        }));
      },


      Program: {
        enter: function enter(_ref2, _ref3) {
          var node = _ref2.node,
              scope = _ref2.scope;
          var file = _ref3.file;

          node[REGISTRATIONS] = []; // eslint-disable-line no-param-reassign

          // Everything in the top level scope, when reasonable,
          // is going to get tagged with __source.
          /* eslint-disable guard-for-in,no-restricted-syntax */
          for (var id in scope.bindings) {
            var binding = scope.bindings[id];
            if (shouldRegisterBinding(binding)) {
              node[REGISTRATIONS].push(buildRegistration({
                ID: binding.identifier,
                NAME: t.stringLiteral(id),
                FILENAME: t.stringLiteral(file.opts.filename)
              }));
            }
          }
          /* eslint-enable */
        },
        exit: function exit(_ref4) {
          var node = _ref4.node,
              scope = _ref4.scope;

          var registrations = node[REGISTRATIONS];
          node[REGISTRATIONS] = null; // eslint-disable-line no-param-reassign

          // Inject the generated tagging code at the very end
          // so that it is as minimally intrusive as possible.
          node.body.push(t.emptyStatement());
          node.body.push(buildTagger({
            UNUSED: scope.generateUidIdentifier(),
            REGISTRATIONS: registrations
          }));
          node.body.push(t.emptyStatement());
        }
      },
      Class: function Class(classPath) {
        var classBody = classPath.get('body');

        classBody.get('body').forEach(function (path) {
          if (path.isClassProperty()) {
            var node = path.node;

            // don't apply transform to static class properties

            if (node.static) {
              return;
            }

            var state = {
              optOut: false
            };

            path.traverse(classPropertyOptOutVistor, state);

            if (state.optOut) {
              return;
            }

            // class property node value is nullable
            if (node.value && node.value.type === 'ArrowFunctionExpression') {
              var isAsync = node.value.async;

              // TODO:
              // Remove this check when babel issue is resolved: https://github.com/babel/babel/issues/5078
              // RHL Issue: https://github.com/gaearon/react-hot-loader/issues/391
              // This code makes async arrow functions not reloadable,
              // but doesn't break code any more when using 'this' inside AAF
              if (isAsync) {
                return;
              }

              var params = node.value.params;

              var newIdentifier = t.identifier('__' + node.key.name + '__REACT_HOT_LOADER__');

              // arrow function body can either be a block statement or a returned expression
              var newMethodBody = node.value.body.type === 'BlockStatement' ? node.value.body : t.blockStatement([t.returnStatement(node.value.body)]);

              // create a new method on the class that the original class property function
              // calls, since the method is able to be replaced by RHL
              var newMethod = t.classMethod('method', newIdentifier, params, newMethodBody);
              newMethod.async = isAsync;
              path.insertAfter(newMethod);

              // replace the original class property function with a function that calls
              // the new class method created above
              path.replaceWith(buildNewClassProperty(t, node.key, newIdentifier, isAsync));
            }
          } else if (!path.node[replaced] && path.node.kind === 'constructor') {
            path.traverse({
              AssignmentExpression: function AssignmentExpression(exp) {
                if (!exp.node[replaced] && exp.node.left.type === 'MemberExpression' && exp.node.left.object.type === 'ThisExpression' && exp.node.right.type === 'ArrowFunctionExpression') {
                  var key = exp.node.left.property;
                  var _node = exp.node.right;

                  var _isAsync = _node.async;
                  var _params = _node.params;

                  var _newIdentifier = t.identifier('__' + key.name + '__REACT_HOT_LOADER__');

                  // arrow function body can either be a block statement or a returned expression
                  var _newMethodBody = _node.body.type === 'BlockStatement' ? _node.body : t.blockStatement([t.returnStatement(_node.body)]);

                  var _newMethod = t.classMethod('method', _newIdentifier, _params, _newMethodBody);
                  _newMethod.async = _isAsync;
                  _newMethod[replaced] = true;
                  path.insertAfter(_newMethod);

                  // replace assignment exp
                  exp.replaceWith(buildNewAssignmentExpression(t, key, _newIdentifier, _isAsync));
                }
              }
            });
          }
        });
      }
    }
  };
};