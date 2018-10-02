'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;


  var buildTemplate = (0, _babelTemplate2.default)('\n    SYSTEM_GLOBAL.registerDynamic(MODULE_ID, [DEPS], false, BODY);\n  ');

  var buildFactory = (0, _babelTemplate2.default)('\n    (function($__require, $__exports, $__module) {\n      MODULE_URI\n      BODY;\n    })\n  ');

  var buildFactoryEs = (0, _babelTemplate2.default)('\n    (function($__require, $__exports, $__module) {\n      var $__moduleValue = (function() {\n        MODULE_URI\n        BODY;\n      })() || $__module.exports;\n      Object.defineProperty($__moduleValue, \'__esModule\', {\n        value: true\n      });\n      return $__moduleValue;\n    });\n  ');

  var buildFactoryTypeCheck = (0, _babelTemplate2.default)('\n    FACTORY_DECLARATION\n    if (typeof FACTORY_REFERENCE === TYPE) {\n      return FACTORY_CALL;\n    } else {\n      return FACTORY_REFERENCE;\n    }\n  ');

  var buildFactoryExpressionDeclaration = (0, _babelTemplate2.default)('\n    var $__factory = FACTORY_EXPRESSION;\n  ');

  var buildModuleURIBinding = (0, _babelTemplate2.default)('\n     $__module.uri = $__module.id;\n  ');

  return {
    pre: function pre() {
      this.amdDeps = [];
      this.anonDefine = false;
      this.anonDefineIndex = -1;
      this.anonNamed = false;
      this.bundleDefines = [];
    },
    post: function post() {
      // Save filtered amd dependencies in the file metadata
      this.file.metadata.amdDeps = this.amdDeps;
      this.file.metadata.anonNamed = this.anonNamed;
    },

    visitor: {
      CallExpression: {
        enter: function enter(path, _ref2) {
          var _this = this;

          var _ref2$opts = _ref2.opts,
              opts = _ref2$opts === undefined ? {} : _ref2$opts;

          var that = this;

          // don't perform nested transformations
          if (this.outerModuleDefinition) {
            return;
          }

          var callee = path.node.callee;
          var args = path.node.arguments;

          // match define(function(require) {})
          // match define(['dep1'], function(dep1) {})
          // match define('moduleName', function(dep1) {})
          // match define('moduleName', ['dep1'], function(dep1) {})
          if (t.isIdentifier(callee, {
            name: 'define'
          }) && !path.scope.hasBinding('define') && args.length >= 1 && args.length <= 3) {

            // remember the outer `define()` to avoid transforming the inner ones
            this.outerModuleDefinition = path;

            if (opts.filterMode) {
              var name = void 0,
                  depArg = -1;

              if (t.isStringLiteral(args[0]) || args[1] && t.isArrayExpression(args[1])) {
                name = args[0].value || true; // if args[0] is a string use it's literal value, else use 'true'
                if (args[1] && t.isArrayExpression(args[1])) {
                  depArg = 1; // deps array is at args index 1
                }
              } else if (t.isArrayExpression(args[0])) {
                depArg = 0; // anonymous define => deps array is at args index 0
              }

              var factoryArg = name && depArg === -1 ? 1 : depArg + 1; // If no deps array is present, the factory must be at index 1. Else it must be at index depArg + 1.

              if (!args[factoryArg]) {
                return; // if no factory param is present, do nothing.
              }

              // note the define index
              // so we know which one to name for the second pass
              if (!this.anonDefine || this.anonNamed) this.anonDefineIndex++;

              var parseamdDeps = false;

              // anonymous define
              if (!name) {
                if (this.anonDefine && !this.anonNamed) throw new Error('Multiple anonymous defines.');

                this.anonDefine = true;
                this.anonNamed = false;
                parseamdDeps = true;
              }
              // named define
              else {
                  if (typeof name !== 'boolean') {
                    this.bundleDefines.push(name);
                    this.amdDeps.splice(this.amdDeps.indexOf(name), 1);
                  }
                  if (!this.anonDefine && this.anonDefineIndex === 0 && typeof name !== 'boolean') {
                    this.anonDefine = true;
                    this.anonNamed = true;
                    parseamdDeps = true;
                  } else if (this.anonDefine && this.anonNamed) {
                    this.anonDefine = false;
                    this.anonNamed = false;
                    this.amdDeps = [];
                  }
                }

              if (!parseamdDeps) {
                return;
              }

              if (depArg !== -1 && args[depArg].elements) {
                args[depArg].elements.forEach(function (dep) {
                  if (['require', 'exports', 'module'].indexOf(dep.value) != -1) return;
                  if (that.bundleDefines.indexOf(dep.value) != -1) return;
                  that.amdDeps.push(dep.value);
                });
              } else if (depArg === -1 && t.isFunctionExpression(args[factoryArg])) {
                (function () {
                  var cjsFactory = args[factoryArg],
                      fnParameters = args[factoryArg].params,
                      requireParam = fnParameters[0];

                  if (requireParam) {
                    var filterAMDamdDeps = {
                      // Visitor to determine all required dependencies if no this.amdDeps array is provided but a factory function with present `require` param.
                      CallExpression: function CallExpression(path) {
                        var callee = path.node.callee;
                        var args = path.node.arguments;

                        // Get function scope of defineFactory where param is used
                        if (path.scope.bindings[requireParam.name] && path.scope.bindings[requireParam.name].identifier === requireParam && t.isIdentifier(callee, {
                          name: requireParam.name
                        })) {
                          that.amdDeps.push(args[0].value);
                        }
                      }
                    };
                    path.traverse(filterAMDamdDeps);
                  }
                })();
              }
            } else {
              var callParams;
              var requireParamIndex;

              (function () {
                var _deps;

                var moduleName = null,
                    deps = [],
                    factoryArg = null,
                    isExportsInDeps = false,
                    isModuleInDepsOrInFactoryParam = false;

                if (args.length === 1) {
                  // first param is factory object/function
                  factoryArg = args[0];
                  // parse factory params
                  if (t.isFunctionExpression(factoryArg)) {
                    factoryArg.params.forEach(function (factoryParam) {
                      if (t.isIdentifier(factoryParam) && factoryParam.name === 'module') {
                        isModuleInDepsOrInFactoryParam = true;
                      }
                    });
                  }
                } else if (args.length === 2) {
                  // first param is either module name or dependency array
                  if (t.isStringLiteral(args[0])) {
                    moduleName = args[0];
                  } else if (t.isArrayExpression(args[0])) {
                    deps = args[0];
                  }
                  // second param is factory object/function
                  factoryArg = args[1];
                } else {
                  // first param is module name
                  moduleName = args[0];
                  // second param is dependency array
                  deps = args[1];
                  // third param is factory object/function
                  factoryArg = args[2];
                }

                // Call params used for the define factories wrapped in IIFEs
                callParams = [];
                requireParamIndex = -1;

                if (t.isArrayExpression(deps)) {
                  // Test if 'exports' exists as dependency: define(['exports'], function(exports) {})
                  isExportsInDeps = deps.elements.filter(function (param) {
                    return param.value === 'exports';
                  }).length > 0;
                  isModuleInDepsOrInFactoryParam = deps.elements.filter(function (param) {
                    return param.value === 'module';
                  }).length > 0;

                  deps.elements.forEach(function (param) {
                    if (['require', 'module', 'exports'].indexOf(param.value) !== -1) {
                      // Add all special identifiers in it's correct order and bind the to the param identifiers of the System.registerDynamic factory.
                      callParams.push(t.identifier('$__' + param.value));
                      if (param.value === 'require') {
                        // Save the index of the factory's require param.
                        requireParamIndex = callParams.length - 1;
                      }
                    } else {
                      callParams.push(t.callExpression(t.identifier('$__require'), [param]));
                    }
                  });

                  // Removal of all special identifiers from the dependency list, which are provided by the System.registerDynamic's factory.
                  deps = deps.elements.filter(function (param) {
                    return ['require', 'module', 'exports'].indexOf(param.value) === -1;
                  });
                }

                var newDeps = [];

                // Handle CommonJS-style factories
                if (deps.length === 0 && t.isFunctionExpression(factoryArg)) {

                  var detectThisAssignments = {
                    // Visitor to determine all assignments to `this` members in a cjs factory function. If so, `exports` must be used as `thisBindingExpression`.
                    ThisExpression: function ThisExpression(path) {

                      var currentPath = path;

                      // Traverse upwards until an assignment expression is reached
                      while (!t.isAssignmentExpression(currentPath.node) && currentPath.parentPath) {
                        currentPath = currentPath.parentPath;
                      }

                      if (t.isAssignmentExpression(currentPath.node)) {
                        var leftAssignmentOperand = currentPath.node.left;
                        if (t.isMemberExpression(leftAssignmentOperand)) {
                          leftAssignmentOperand = leftAssignmentOperand.object;
                          // Get base operand of member expression
                          while (leftAssignmentOperand.object) {
                            leftAssignmentOperand = leftAssignmentOperand.object;
                          }
                        }
                      }
                    }
                  };

                  // We need to traverse over the complete path, since we didn't get the path of the cjs factory here.
                  // TODO: Find a way to provide path of the cjs factory!!!
                  path.traverse(detectThisAssignments, {});

                  // Iterate over each param of the cjs factory
                  factoryArg.params.forEach(function (param, index) {
                    switch (index) {
                      // require
                      case 0:
                        var filterAMDDeps = {
                          // Visitor to determine all required dependencies if no DEPS array is provided but a factory function with present require param.
                          CallExpression: function CallExpression(path) {
                            var callee = path.node.callee;
                            var args = path.node.arguments;

                            // Get function scope of defineFactory where param is used
                            if (path.scope.bindings[param.name] && path.scope.bindings[param.name].identifier === param && t.isIdentifier(callee, {
                              name: param.name
                            })) {
                              newDeps.push(args[0]);
                            }
                          }
                        };

                        // We need to traverse over the complete path, since we didn't get the path of defineFactore here
                        // TODO: Find a way to provide path of the cjs factory!!!
                        path.traverse(filterAMDDeps, {});

                        // Push $__require to call params if used as factory default param
                        callParams.push(t.identifier('$__require'));
                        break;
                      // exports
                      case 1:
                        // Push $__require to call params if used as factory default param
                        callParams.push(t.identifier('$__exports'));
                        // Boolean flag which indicates that ```exports``` is present as factory param
                        isExportsInDeps = true;
                        break;
                      // module
                      case 2:
                        // Push $__require to call params if used as factory default param
                        callParams.push(t.identifier('$__module'));
                        break;
                    }
                  });
                }

                if (requireParamIndex !== -1 && t.isFunctionExpression(factoryArg)) {
                  var remapRequiredDeps = {
                    CallExpression: function CallExpression(path) {
                      var callee = path.node.callee;
                      var args = path.node.arguments;
                      if (t.isIdentifier(callee, {
                        name: factoryArg.params[requireParamIndex] && factoryArg.params[requireParamIndex].name
                      }) && t.isStringLiteral(args[0])) {
                        if (typeof opts.map === 'function') {
                          args[0].value = opts.map(args[0].value);
                        }
                      }
                    }
                  };
                  path.traverse(remapRequiredDeps, {});
                }

                var factoryReferenceIdentifier = void 0,
                    factoryAsExpressionDeclaration = void 0;
                var thisBindingExpression = isExportsInDeps ? t.identifier('$__exports') : t.thisExpression();
                if (t.isFunctionExpression(factoryArg)) {
                  // If factory is passed as function argument
                  var call = t.memberExpression(t.parenthesizedExpression(factoryArg), t.identifier('call'));
                  factoryArg = t.callExpression(call, [thisBindingExpression].concat(_toConsumableArray(callParams)));
                } else if (t.isIdentifier(factoryArg)) {
                  // If factory is passed as identifier argument
                  factoryReferenceIdentifier = t.identifier(factoryArg.name);
                  var _call = t.memberExpression(factoryArg, t.identifier('call'));
                  factoryArg = t.callExpression(_call, [thisBindingExpression].concat(_toConsumableArray(callParams)));
                } else if (!t.isObjectExpression(factoryArg)) {
                  // If factory is passed as expression argument
                  factoryReferenceIdentifier = t.identifier('$__factory');
                  factoryAsExpressionDeclaration = buildFactoryExpressionDeclaration({
                    FACTORY_EXPRESSION: t.parenthesizedExpression(factoryArg)
                  });
                  var _call2 = t.memberExpression(factoryReferenceIdentifier, t.identifier('call'));
                  factoryArg = t.callExpression(_call2, [thisBindingExpression].concat(_toConsumableArray(callParams)));
                }

                var factoryTypeTestNeeded = false;
                if ((!moduleName || moduleName && deps.length === 0) && factoryReferenceIdentifier) {
                  // Wraps the factory in a ```if (typeof factory === 'function') {}``` test only a factory reference is present
                  factoryTypeTestNeeded = true;
                  factoryArg = buildFactoryTypeCheck({
                    FACTORY_REFERENCE: factoryReferenceIdentifier,
                    FACTORY_CALL: factoryArg,
                    TYPE: t.stringLiteral('function'),
                    FACTORY_DECLARATION: factoryAsExpressionDeclaration || null
                  });
                }

                var esModule = opts.esModule;
                if (esModule) {
                  path.traverse({
                    StringLiteral: function StringLiteral(path) {
                      if (this.functionDepth < 2 && path.node.value === '__esModule') {
                        esModule = false;
                        path.stop();
                      }
                    },
                    MemberExpression: function MemberExpression(path) {
                      if (this.functionDepth < 2 && path.node.property.name === '__esModule') {
                        esModule = false;
                        path.stop();
                      }
                    },
                    ObjectProperty: function ObjectProperty(path) {
                      if (this.functionDepth < 2 && path.node.key.name === '__esModule') {
                        esModule = false;
                        path.stop();
                      }
                    },

                    Scope: {
                      enter: function enter(path) {
                        if (t.isFunction(path.scope.block)) this.functionDepth++;
                        if (this.functionDepth > 2) path.skip();
                      },
                      exit: function exit(path) {
                        if (t.isFunction(path.scope.block)) this.functionDepth--;
                      }
                    }
                  }, { functionDepth: 0 });
                }

                var factory = (esModule ? buildFactoryEs : buildFactory)({
                  MODULE_URI: isModuleInDepsOrInFactoryParam ? buildModuleURIBinding() : null,
                  BODY: factoryTypeTestNeeded ? factoryArg : t.returnStatement(factoryArg)
                });

                // Concat with required depencies array which contains string literals if factory default params are used
                deps = (_deps = deps).concat.apply(_deps, newDeps);
                if (opts.deps) {
                  // Concat all dependencies passed via the plugin's' options.
                  deps = deps.concat(opts.deps.map(function (dep) {
                    return t.stringLiteral(dep);
                  }).filter(function (loadDep) {
                    // Filter out already contained dependencies
                    return deps.filter(function (dep) {
                      return dep.value === loadDep.value;
                    }).length === 0;
                  }));
                }

                // Map dependencies using the dependency mapping function hook
                if (typeof opts.map === 'function') {
                  deps.forEach(function (e) {
                    e.value = opts.map(e.value);
                  });
                }

                var moduleId = _this.getModuleName();

                var systemRegister = buildTemplate({
                  SYSTEM_GLOBAL: opts.systemGlobal && t.identifier(opts.systemGlobal) || t.identifier('System'),
                  MODULE_ID: !opts.anonNamed && moduleName || moduleId && t.stringLiteral(moduleId),
                  DEPS: [].concat(_toConsumableArray(deps)),
                  BODY: factory
                });

                path.replaceWith(systemRegister);
              })();
            }
          }
        },
        exit: function exit(path) {
          // are we inside a `define()`?
          if (this.outerModuleDefinition === path) {
            this.outerModuleDefinition = null;
          }
        }
      },
      MemberExpression: function MemberExpression(path, _ref3) {
        var opts = _ref3.opts;

        if (!opts.filterMode) {
          // Replace `define.amd` with `true` if it's used inside a logical expression,
          // and replace `typeof define.amd` with `'object'`
          if (t.isIdentifier(path.node.object, { name: 'define' }) && (t.isIdentifier(path.node.property, { name: 'amd' }) || t.isStringLiteral(path.node.property, { value: 'amd' })) && !path.scope.hasBinding('define') && path.parentPath) {
            if (t.isLogicalExpression(path.parentPath)) path.replaceWith(t.booleanLiteral(true));else if (t.isUnaryExpression(path.parentPath) && path.parentPath.node.operator === 'typeof') path.parentPath.replaceWith(t.stringLiteral('object'));
          }
        }
      },
      UnaryExpression: function UnaryExpression(path, _ref4) {
        var opts = _ref4.opts;

        if (!opts.filterMode) {
          // Replace `typeof define` if it's used inside a unary expression.
          if (!path.scope.hasBinding('define') && path.node.operator === 'typeof' && path.node.argument.name === 'define') path.replaceWith(t.stringLiteral('function'));
        }
      }
    }
  };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }