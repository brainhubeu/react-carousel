'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var _visitor;

  var t = _ref.types;


  var requireIdentifier = t.identifier('require');

  var buildTemplate = (0, _babelTemplate2.default)('\n    SYSTEM_GLOBAL.registerDynamic(MODULE_NAME, [DEPS], true, BODY);\n  ');

  var buildFactory = (0, _babelTemplate2.default)('\n    (function (require, exports, module) {\n      BODY\n    })\n  ');

  var buildDefineGlobal = (0, _babelTemplate2.default)('\n     var global = this || self, GLOBAL = global;\n  ');

  var buildStaticFilePaths = (0, _babelTemplate2.default)('\n    var __filename = FILENAME, __dirname = DIRNAME;\n  ');

  var buildDynamicFilePaths = (0, _babelTemplate2.default)('\n    var $__pathVars = SYSTEM_GLOBAL.registry.get(\'@@cjs-helpers\').getPathVars(module.id), __filename = $__pathVars.filename, __dirname = $__pathVars.dirname;\n  ');

  var buildRequireResolveFacade = (0, _babelTemplate2.default)('\n    require.resolve = function(request) {\n       return SYSTEM_GLOBAL.registry.get(\'@@cjs-helpers\').requireResolve(request, module.id);\n    }\n  ');

  var buildEsModule = (0, _babelTemplate2.default)('\n    Object.defineProperty(module.exports, \'__esModule\', { value: true });\n  ');

  return {
    pre: function pre() {
      this.usesFilePaths = false;
      this.usesRequireResolve = false;
    },

    visitor: (_visitor = {
      CallExpression: function CallExpression(path, _ref2) {
        var _ref2$opts = _ref2.opts;
        var opts = _ref2$opts === undefined ? {} : _ref2$opts;

        var callee = path.node.callee;
        var args = path.node.arguments;

        var _opts$requireName = opts.requireName;
        var requireName = _opts$requireName === undefined ? 'require' : _opts$requireName;
        var map = opts.map;

        // test if require.resolve is present

        if (!this.usesRequireResolve && t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: requireName }) && t.isIdentifier(callee.property, { name: 'resolve' })) {
          this.usesRequireResolve = true;
        }

        // found a require
        if (t.isIdentifier(callee, { name: requireName }) && args.length == 1) {

          // require('x');
          if (t.isStringLiteral(args[0])) {

            var requiredModuleName = args[0].value;

            // mirror behaviour at https://github.com/systemjs/systemjs/blob/0.19.8/lib/cjs.js#L50 to remove trailing slash
            if (requiredModuleName[requiredModuleName.length - 1] == '/') {
              requiredModuleName = requiredModuleName.substr(0, requiredModuleName.length - 1);
            }

            if (typeof map === 'function') {
              requiredModuleName = map(requiredModuleName) || requiredModuleName;
            }

            args[0].value = requiredModuleName;
          }
        }
      },
      StringLiteral: function StringLiteral(path) {
        if (this.opts.esModule && this.functionDepth < 2 && path.node.value === '__esModule') this.hasEsModule = true;
      },
      MemberExpression: function MemberExpression(path) {
        if (this.opts.esModule && this.functionDepth < 2 && path.node.property.name === '__esModule') this.hasEsModule = true;
      },
      ObjectProperty: function ObjectProperty(path) {
        if (this.opts.esModule && this.functionDepth < 2 && path.node.key.name === '__esModule') this.hasEsModule = true;
      },

      Scope: {
        enter: function enter(path) {
          if (this.opts.esModule && t.isFunction(path.scope.block)) this.functionDepth++;
        },
        exit: function exit(path) {
          if (this.opts.esModule && t.isFunction(path.scope.block)) this.functionDepth--;
        }
      }
    }, _defineProperty(_visitor, 'MemberExpression', function MemberExpression(path, _ref3) {
      var _ref3$opts = _ref3.opts;
      var opts = _ref3$opts === undefined ? {} : _ref3$opts;
      var node = path.node;


      if (this.opts.esModule && path.node.property.name === '__esModule') this.hasEsModule = true;

      // optimize process.env.NODE_ENV to 'production'
      if (opts.optimize && t.isIdentifier(node.object.object, { name: 'process' }) && t.isIdentifier(node.object.property, { name: 'env' }) && t.isIdentifier(node.property, { name: 'NODE_ENV' })) {
        path.replaceWith(t.stringLiteral('production'));
      }

      if (opts.systemGlobal != 'System' && t.isIdentifier(node.object, { name: 'System' }) && t.isIdentifier(node.property, { name: '_nodeRequire' })) {
        node.object = t.identifier(opts.systemGlobal);
      }
    }), _defineProperty(_visitor, 'ReferencedIdentifier', function ReferencedIdentifier(path, state) {
      if (path.node.name == 'define' && !path.scope.hasBinding('define') && (!t.isExpression(path.parentPath) || t.isUnaryExpression(path.parentPath) && path.parentPath.node.operator === 'typeof')) {
        path.replaceWith(t.identifier('undefined'));
      }
    }), _defineProperty(_visitor, 'Identifier', function Identifier(path) {
      var node = path.node;
      // test if file paths are used

      if (t.isIdentifier(node, { name: '__filename' }) || t.isIdentifier(node, { name: '__dirname' })) {
        this.usesFilePaths = true;
      }
    }), _defineProperty(_visitor, 'ThisExpression', function ThisExpression(path, state) {
      if (!path.scope.parent) path.replaceWith(t.identifier('exports'));
    }), _defineProperty(_visitor, 'Program', {
      enter: function enter() {
        this.functionDepth = 0;
      },
      exit: function exit(path, _ref4) {
        var _ref4$opts = _ref4.opts;
        var opts = _ref4$opts === undefined ? {} : _ref4$opts;
        var _opts$requireName2 = opts.requireName;
        var requireName = _opts$requireName2 === undefined ? 'require' : _opts$requireName2;
        var _opts$mappedRequireNa = opts.mappedRequireName;
        var mappedRequireName = _opts$mappedRequireNa === undefined ? '$__require' : _opts$mappedRequireNa;


        opts.static = opts.static === true || false;

        var systemGlobal = t.identifier(opts.systemGlobal || 'System');

        var moduleName = this.getModuleName();
        moduleName = moduleName ? t.stringLiteral(moduleName) : null;

        var _opts$deps = opts.deps;
        var deps = _opts$deps === undefined ? [] : _opts$deps;

        deps = deps.map(function (d) {
          return t.stringLiteral(d);
        });

        if (this.usesRequireResolve && !opts.static) {
          path.node.body.unshift(buildRequireResolveFacade({
            SYSTEM_GLOBAL: systemGlobal
          }));
        }

        if (this.usesFilePaths && !opts.static) {
          path.node.body.unshift(buildDynamicFilePaths({
            SYSTEM_GLOBAL: systemGlobal
          }));
        }

        if (this.usesFilePaths && opts.static) {
          var filename = opts.path || '';
          var dirname = filename.split('/').slice(0, -1).join('/');

          path.node.body.unshift(buildStaticFilePaths({
            FILENAME: t.stringLiteral(filename),
            DIRNAME: t.stringLiteral(dirname)
          }));
        }

        path.node.body.unshift(buildDefineGlobal());

        var globals = opts.globals;

        if (globals && Object.keys(globals).length) {
          var globalAssignments = Object.keys(globals).filter(function (g) {
            return globals[g];
          }).map(function (g) {
            var globalIdentifier = t.identifier(g);
            var value = t.callExpression(requireIdentifier, [t.stringLiteral(globals[g])]);
            var assignment = t.assignmentPattern(globalIdentifier, value);
            return t.variableDeclarator(assignment);
          });
          globals = t.variableDeclaration('var', globalAssignments);
          path.node.body.unshift(globals);
        }

        if (opts.esModule && !this.hasEsModule) path.node.body.push(buildEsModule());

        var factory = buildFactory({
          BODY: path.node.body
        });

        factory.expression.body.directives = path.node.directives;
        path.node.directives = [];

        path.node.body = [buildTemplate({
          SYSTEM_GLOBAL: systemGlobal,
          MODULE_NAME: moduleName,
          DEPS: deps,
          BODY: factory
        })];

        var remapFactoryScopedRequire = {
          FunctionExpression: function FunctionExpression(path) {
            if (path.node == factory.expression) {
              path.scope.rename(this.requireName, this.mappedRequireName);
            }
          }
        };

        path.traverse(remapFactoryScopedRequire, {
          requireName: requireName,
          mappedRequireName: mappedRequireName
        });
      }
    }), _visitor)
  };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }