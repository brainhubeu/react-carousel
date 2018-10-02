'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref2) {
  var t = _ref2.types;

  return {
    visitor: {
      CallExpression: function CallExpression(path, _ref3) {
        var _ref3$opts = _ref3.opts;
        var opts = _ref3$opts === undefined ? {} : _ref3$opts;

        var callee = path.node.callee;
        var args = path.node.arguments;
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: 'System' }) && t.isIdentifier(callee.property, { name: 'register' })) {
          callee.object.name = opts.systemGlobal || 'System';

          var _args = _slicedToArray(args, 2);

          var firstArg = _args[0];
          var declare = _args[1];

          // System.register(deps, declare)

          if (t.isArrayExpression(firstArg)) {
            if (this.hasAnonRegister) throw new Error('Source ' + this.name + ' has multiple anonymous System.register calls.');

            // normalize dependencies in array
            // NB add metadata.deps here too
            if (typeof opts.map === 'function') {
              firstArg.elements.forEach(function (e) {
                e.value = opts.map(e.value);
              });
            }

            this.hasAnonRegister = true;

            if (opts.moduleName) {
              args.unshift(t.stringLiteral(opts.moduleName));
            }
          }
          // System.register(name, deps, declare)
          else {
              declare = args[2];
            }

          // contains a __moduleName reference, while System.register declare function doesn't have a __moduleName argument
          // so add it
          // this is backwards compatibility for https://github.com/systemjs/builder/issues/416
          if (t.isFunctionExpression(declare) && declare.params.length === 1) {
            var state = {};
            path.traverse(findModuleNameVisitor, state);
            if (state.usesModuleName) {
              declare.params.push(t.identifier('__moduleName'));
            }
          }
        }
      },

      Program: {
        exit: function exit() {
          // if the transformer didn't find an anonymous System.register
          // then this is a bundle itself
          // so we need to reconstruct files with load.metadata.execute etc
          // if this comes up, we can tackle it or work around it
          if (!this.hasAnonRegister) throw new TypeError('Source ' + this.name + ' is already a bundle file, so can\'t be built as a module.');
        }
      }
    }
  };
};

var findModuleNameVisitor = {
  Identifier: function Identifier(_ref) {
    var node = _ref.node;

    if (node.name === '__moduleName') this.usesModuleName = true;
  }
};

// converts anonymous System.register([] into named System.register('name', [], ...
// NB need to add that if no anon, last named must define this module