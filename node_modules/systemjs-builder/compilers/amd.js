var vm = require('vm');
var compiler = require('./compiler');
var Promise = require('bluebird');

// override System instantiate to handle AMD dependencies
exports.attach = function (loader) {
  var systemInstantiate = loader.instantiate;
  loader.instantiate = function (load) {
    var loader = this;

    return systemInstantiate.call(this, load).then(function (result) {
      if (load.metadata.format == 'amd') {

        if (!load.source) load.source = ' ';

        var output = compiler.compileAst(load, [require('babel-plugin-transform-amd-system-wrapper').default, { filterMode: true }]);
        load.metadata.ast = output.ast;
        load.metadata.anonNamed = output.metadata.anonNamed;

        var entry = loader.defined[load.name];
        entry.deps = dedupe(output.metadata.amdDeps.concat(load.metadata.deps));

        load.metadata.builderExecute = function (require, exports, module) {
          var removeDefine = loader.get('@@amd-helpers').createDefine(loader);

          // NB source maps, System overwriting skipped here
          vm.runInThisContext(load.source);

          removeDefine(loader);

          var lastModule = loader.get('@@amd-helpers').lastModule;

          if (!lastModule.anonDefine && !lastModule.isBundle)
            throw new TypeError('AMD module ' + load.name + ' did not define');

          if (lastModule.anonDefine)
            return lastModule.anonDefine.execute.apply(this, arguments);

          lastModule.isBundle = false;
          lastModule.anonDefine = null;
        };

        // first, normalize all dependencies
        var normalizePromises = [];
        for (var i = 0, l = entry.deps.length; i < l; i++) {
          normalizePromises.push(Promise.resolve(loader.normalize(entry.deps[i], load.name)));
        }

        return Promise.all(normalizePromises).then(function (normalizedDeps) {
          entry.normalizedDeps = normalizedDeps;
          entry.originalIndices = group(entry.deps);

          return {
            deps: entry.deps,
            execute: result.execute
          };
        });
      }

      return result;
    });
  };
};

function dedupe(deps) {
  var newDeps = [];
  for (var i = 0, l = deps.length; i < l; i++)
    if (newDeps.indexOf(deps[i]) == -1)
      newDeps.push(deps[i])
  return newDeps;
}

function group(deps) {
  var names = [];
  var indices = [];
  for (var i = 0, l = deps.length; i < l; i++) {
    var index = names.indexOf(deps[i]);
    if (index === -1) {
      names.push(deps[i]);
      indices.push([i]);
    }
    else {
      indices[index].push(i);
    }
  }
  return { names: names, indices: indices };
}

// converts anonymous AMDs into named AMD for the module
exports.compile = function (load, opts, loader) {
  opts.moduleId = !opts.anonymous && load.name;
  return compiler.compile(load, opts, [require('babel-plugin-transform-amd-system-wrapper').default, {
    anonNamed: load.metadata.anonNamed,
    map: function (dep) {
      return opts.normalize ? load.depMap[dep] : dep;
    },
    systemGlobal: opts.systemGlobal,
	  deps: load.deps,
    esModule: load.metadata.esModule
  }]);
};
