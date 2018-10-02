'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    /**
     * Add a helper to take an initial descriptor, apply some decorators to it, and optionally
     * define the property.
     */
    function ensureApplyDecoratedDescriptorHelper(path, state) {
        if (!state.applyDecoratedDescriptor) {
            state.applyDecoratedDescriptor = path.scope.generateUidIdentifier('applyDecoratedDescriptor');
            var helper = buildApplyDecoratedDescriptor({
                NAME: state.applyDecoratedDescriptor
            });
            path.scope.getProgramParent().path.unshiftContainer('body', helper);
        }

        return state.applyDecoratedDescriptor;
    }

    /**
     * Add a helper to call as a replacement for class property definition.
     */
    function ensureInitializerDefineProp(path, state) {
        if (!state.initializerDefineProp) {
            state.initializerDefineProp = path.scope.generateUidIdentifier('initDefineProp');
            var helper = buildInitializerDefineProperty({
                NAME: state.initializerDefineProp
            });
            path.scope.getProgramParent().path.unshiftContainer('body', helper);
        }

        return state.initializerDefineProp;
    }

    /**
     * Add a helper that will throw a useful error if the transform fails to detect the class
     * property assignment, so users know something failed.
     */
    function ensureInitializerWarning(path, state) {
        if (!state.initializerWarningHelper) {
            state.initializerWarningHelper = path.scope.generateUidIdentifier('initializerWarningHelper');
            var helper = buildInitializerWarningHelper({
                NAME: state.initializerWarningHelper
            });
            path.scope.getProgramParent().path.unshiftContainer('body', helper);
        }

        return state.initializerWarningHelper;
    }

    /**
     * If the decorator expressions are non-identifiers, hoist them to before the class so we can be sure
     * that they are evaluated in order.
     */
    function applyEnsureOrdering(path) {
        // TODO: This should probably also hoist computed properties.
        var decorators = (path.isClass() ? [path].concat(path.get('body.body')) : path.get('properties')).reduce(function (acc, prop) {
            return acc.concat(prop.node.decorators || []);
        }, []);

        var identDecorators = decorators.filter(function (decorator) {
            return !t.isIdentifier(decorator.expression);
        });
        if (identDecorators.length === 0) return;

        return t.sequenceExpression(identDecorators.map(function (decorator) {
            var expression = decorator.expression;
            var id = decorator.expression = path.scope.generateDeclaredUidIdentifier('dec');
            return t.assignmentExpression('=', id, expression);
        }).concat([path.node]));
    }

    /**
     * Given a class expression with class-level decorators, create a new expression
     * with the proper decorated behavior.
     */
    function applyClassDecorators(classPath, state) {
        var decorators = classPath.node.decorators || [];
        classPath.node.decorators = null;

        if (decorators.length === 0) return;

        var name = classPath.scope.generateDeclaredUidIdentifier('class');

        return decorators.map(function (dec) {
            return dec.expression;
        }).reverse().reduce(function (acc, decorator) {
            return buildClassDecorator({
                CLASS_REF: name,
                DECORATOR: decorator,
                INNER: acc
            }).expression;
        }, classPath.node);
    }

    /**
     * Given a class expression with method-level decorators, create a new expression
     * with the proper decorated behavior.
     */
    function applyMethodDecorators(path, state) {
        var hasMethodDecorators = path.node.body.body.some(function (node) {
            return (node.decorators || []).length > 0;
        });

        if (!hasMethodDecorators) return;

        return applyTargetDecorators(path, state, path.node.body.body);
    }

    /**
     * Given an object expression with property decorators, create a new expression
     * with the proper decorated behavior.
     */
    function applyObjectDecorators(path, state) {
        var hasMethodDecorators = path.node.properties.some(function (node) {
            return (node.decorators || []).length > 0;
        });

        if (!hasMethodDecorators) return;

        return applyTargetDecorators(path, state, path.node.properties);
    }

    /**
     * A helper to pull out property decorators into a sequence expression.
     */
    function applyTargetDecorators(path, state, decoratedProps) {
        var descName = path.scope.generateDeclaredUidIdentifier('desc');
        var valueTemp = path.scope.generateDeclaredUidIdentifier('value');

        var name = path.scope.generateDeclaredUidIdentifier(path.isClass() ? 'class' : 'obj');

        var exprs = decoratedProps.reduce(function (acc, node) {
            var decorators = node.decorators || [];
            node.decorators = null;

            if (decorators.length === 0) return acc;

            if (node.computed) {
                throw path.buildCodeFrameError('Computed method/property decorators are not yet supported.');
            }

            var property = t.isLiteral(node.key) ? node.key : t.stringLiteral(node.key.name);

            var target = path.isClass() && !node.static ? buildClassPrototype({
                CLASS_REF: name
            }).expression : name;

            if (t.isClassProperty(node, { static: false })) {
                var descriptor = path.scope.generateDeclaredUidIdentifier('descriptor');

                var initializer = node.value ? t.functionExpression(null, [], t.blockStatement([t.returnStatement(node.value)])) : t.nullLiteral();
                node.value = t.callExpression(ensureInitializerWarning(path, state), [descriptor, t.thisExpression()]);

                acc = acc.concat([t.assignmentExpression('=', descriptor, t.callExpression(ensureApplyDecoratedDescriptorHelper(path, state), [target, property, t.arrayExpression(decorators.map(function (dec) {
                    return dec.expression;
                })), t.objectExpression([t.objectProperty(t.identifier('enumerable'), t.booleanLiteral(true)), t.objectProperty(t.identifier('initializer'), initializer)])]))]);
            } else {
                acc = acc.concat(t.callExpression(ensureApplyDecoratedDescriptorHelper(path, state), [target, property, t.arrayExpression(decorators.map(function (dec) {
                    return dec.expression;
                })), t.isObjectProperty(node) || t.isClassProperty(node, { static: true }) ? buildGetObjectInitializer({
                    TEMP: path.scope.generateDeclaredUidIdentifier('init'),
                    TARGET: target,
                    PROPERTY: property
                }).expression : buildGetDescriptor({
                    TARGET: target,
                    PROPERTY: property
                }).expression, target]));
            }

            return acc;
        }, []);

        return t.sequenceExpression([t.assignmentExpression('=', name, path.node), t.sequenceExpression(exprs), name]);
    }

    return {
        inherits: require("babel-plugin-syntax-decorators"),

        visitor: {
            ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
                if (!path.get("declaration").isClassDeclaration()) return;

                var node = path.node;

                var ref = node.declaration.id || path.scope.generateUidIdentifier("default");
                node.declaration.id = ref;

                // Split the class declaration and the export into two separate statements.
                path.replaceWith(node.declaration);
                path.insertAfter(t.exportNamedDeclaration(null, [t.exportSpecifier(ref, t.identifier('default'))]));
            },
            ClassDeclaration: function ClassDeclaration(path) {
                var node = path.node;


                var ref = node.id || path.scope.generateUidIdentifier("class");

                path.replaceWith(t.variableDeclaration("let", [t.variableDeclarator(ref, t.toExpression(node))]));
            },
            ClassExpression: function ClassExpression(path, state) {
                // Create a replacement for the class node if there is one. We do one pass to replace classes with
                // class decorators, and a second pass to process method decorators.
                var decoratedClass = applyEnsureOrdering(path) || applyClassDecorators(path, state) || applyMethodDecorators(path, state);

                if (decoratedClass) path.replaceWith(decoratedClass);
            },
            ObjectExpression: function ObjectExpression(path, state) {
                var decoratedObject = applyEnsureOrdering(path) || applyObjectDecorators(path, state);

                if (decoratedObject) path.replaceWith(decoratedObject);
            },
            AssignmentExpression: function AssignmentExpression(path, state) {
                if (!state.initializerWarningHelper) return;

                if (!path.get('left').isMemberExpression()) return;
                if (!path.get('left.property').isIdentifier()) return;
                if (!path.get('right').isCallExpression()) return;
                if (!path.get('right.callee').isIdentifier({ name: state.initializerWarningHelper.name })) return;

                path.replaceWith(t.callExpression(ensureInitializerDefineProp(path, state), [path.get('left.object').node, t.stringLiteral(path.get('left.property').node.name), path.get('right.arguments')[0].node, path.get('right.arguments')[1].node]));
            }
        }
    };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildClassDecorator = (0, _babelTemplate2.default)('\n  DECORATOR(CLASS_REF = INNER) || CLASS_REF;\n');

var buildClassPrototype = (0, _babelTemplate2.default)('\n  CLASS_REF.prototype;\n');

var buildGetDescriptor = (0, _babelTemplate2.default)('\n    Object.getOwnPropertyDescriptor(TARGET, PROPERTY);\n');

var buildGetObjectInitializer = (0, _babelTemplate2.default)('\n    (TEMP = Object.getOwnPropertyDescriptor(TARGET, PROPERTY), (TEMP = TEMP ? TEMP.value : undefined), {\n        enumerable: true,\n        configurable: true,\n        writable: true,\n        initializer: function(){\n            return TEMP;\n        }\n    })\n');

var buildInitializerWarningHelper = (0, _babelTemplate2.default)('\n    function NAME(descriptor, context){\n        throw new Error(\'Decorating class property failed. Please ensure that transform-class-properties is enabled.\');\n    }\n');

var buildInitializerDefineProperty = (0, _babelTemplate2.default)('\n    function NAME(target, property, descriptor, context){\n        if (!descriptor) return;\n\n        Object.defineProperty(target, property, {\n            enumerable: descriptor.enumerable,\n            configurable: descriptor.configurable,\n            writable: descriptor.writable,\n            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0,\n        });\n    }\n');

var buildApplyDecoratedDescriptor = (0, _babelTemplate2.default)('\n    function NAME(target, property, decorators, descriptor, context){\n        var desc = {};\n        Object[\'ke\' + \'ys\'](descriptor).forEach(function(key){\n            desc[key] = descriptor[key];\n        });\n        desc.enumerable = !!desc.enumerable;\n        desc.configurable = !!desc.configurable;\n        if (\'value\' in desc || desc.initializer){\n            desc.writable = true;\n        }\n\n        desc = decorators.slice().reverse().reduce(function(desc, decorator){\n            return decorator(target, property, desc) || desc;\n        }, desc);\n\n        if (context && desc.initializer !== void 0){\n            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;\n            desc.initializer = undefined;\n        }\n\n        if (desc.initializer === void 0){\n            // This is a hack to avoid this being processed by \'transform-runtime\'.\n            // See issue #9.\n            Object[\'define\' + \'Property\'](target, property, desc);\n            desc = null;\n        }\n\n        return desc;\n    }\n');

;