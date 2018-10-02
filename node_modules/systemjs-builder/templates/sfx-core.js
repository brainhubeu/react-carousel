(function (global) {
  var registry = {};

  var BASE_OBJECT = typeof Symbol !== 'undefined' ? Symbol() : '@@baseObject';

  function extendNamespace (key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get: function () {
        return this[BASE_OBJECT][key];
      }
    });
  }

  function createExternalModule (exports) {
    // a real ES module or SystemJS ES Module
    if (typeof System !== 'undefined' && System.isModule ? System.isModule(exports) :
      Object.prototype.toString.call(exports) === '[object Module]') {
      return exports;
    }

    var esModule = { default: exports, __useDefault: exports };

    // CJS es module -> lift into namespace
    if (exports && exports.__esModule) {
      for (var p in exports) {
        if (Object.hasOwnProperty.call(exports, p))
          esModule[p] = exports[p];
      }
    }

    return new Module(esModule);
  }

  function Module (bindings) {
    Object.defineProperty(this, BASE_OBJECT, {
      value: bindings
    });
    Object.keys(bindings).forEach(extendNamespace, this);
  }
  Module.prototype = Object.create(null);
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    Module.prototype[Symbol.toStringTag] = 'Module';

  var nodeRequire = typeof System != 'undefined' && System._nodeRequire || typeof require != 'undefined' && typeof require.resolve != 'undefined' && typeof process != 'undefined' && process.platform && require;

  function getLoad (key) {
    if (key.substr(0, 6) === '@node/')
      return defineModule(key, createExternalModule(nodeRequire(key.substr(6))), {});
    else
      return registry[key];
  }

  function load (key) {
    var load = getLoad(key);

    if (!load)
      throw new Error('Module "' + key + '" expected, but not contained in build.');

    if (load.module)
      return load.module;

    var link = load.linkRecord;

    instantiate(load, link);

    doEvaluate(load, link, []);

    return load.module;
  }

  function instantiate (load, link) {
    // circular stop condition
    if (link.depLoads)
      return;

    if (link.declare)
      registerDeclarative(load, link);

    link.depLoads = [];
    for (var i = 0; i < link.deps.length; i++) {
      var depLoad = getLoad(link.deps[i]);
      link.depLoads.push(depLoad);
      if (depLoad.linkRecord)
        instantiate(depLoad, depLoad.linkRecord);

      var setter = link.setters && link.setters[i];
      if (setter) {
        setter(depLoad.module || depLoad.linkRecord.moduleObj);
        depLoad.importerSetters.push(setter);
      }
    }

    return load;
  }

  function registerDeclarative (load, link) {
    var moduleObj = link.moduleObj;
    var importerSetters = load.importerSetters;

    var locked = false;

    // closure especially not based on link to allow link record disposal
    var declared = link.declare.call(global, function (name, value) {
      // export setter propogation with locking to avoid cycles
      if (locked)
        return;

      if (typeof name == 'object') {
        for (var p in name)
          if (p !== '__useDefault')
            moduleObj[p] = name[p];
      }
      else {
        moduleObj[name] = value;
      }

      locked = true;
      for (var i = 0; i < importerSetters.length; i++)
        importerSetters[i](moduleObj);
      locked = false;

      return value;
    }, { id: load.key });

    if (typeof declared !== 'function') {
      link.setters = declared.setters;
      link.execute = declared.execute;
    }
    else {
      link.setters = [];
      link.execute = declared;
    }
  }

  function register (key, deps, declare) {
    return registry[key] = {
      key: key,
      module: undefined,
      importerSetters: [],
      linkRecord: {
        deps: deps,
        depLoads: undefined,
        declare: declare,
        setters: undefined,
        execute: undefined,
        moduleObj: {}
      }
    };
  };

  function registerDynamic (key, deps, executingRequire, execute) {
    var exports = {};
    return registry[key] = {
      key: key,
      module: undefined,
      importerSetters: [],
      linkRecord: {
        deps: deps,
        depLoads: undefined,
        declare: undefined,
        execute: execute,
        executingRequire: executingRequire,
        moduleObj: {
          default: exports,
          __useDefault: exports
        },
        setters: undefined
      }
    };
  }

  function makeDynamicRequire (deps, depLoads, seen) {
    // we can only require from already-known dependencies
    return function (name) {
      for (var i = 0; i < deps.length; i++)
        if (deps[i] === name) {
          var depLoad = depLoads[i];
          var depLink = depLoad.linkRecord;
          var module;
          if (depLink) {
            if (seen.indexOf(depLoad) === -1)
              module = doEvaluate(depLoad, depLink, seen);
            else
              module = depLink.moduleObj;
          }
          else {
            module = depLoad.module;
          }
          return '__useDefault' in module ? module.__useDefault : module;
        }
    };
  }

  function doEvaluate (load, link, seen) {
    seen.push(load);

    if (load.module)
      return load.module;

    var err;

    // es modules evaluate dependencies first
    if (link.setters) {
      for (var i = 0; i < link.deps.length; i++) {
        var depLoad = link.depLoads[i];
        var depLink = depLoad.linkRecord;

        if (depLink && seen.indexOf(depLoad) === -1)
          err = doEvaluate(depLoad, depLink, depLink.setters ? seen : []);
      }

      link.execute.call(nullContext);
    }
    else {
      var module = { id: load.key };
      var moduleObj = link.moduleObj;
      Object.defineProperty(module, 'exports', {
        configurable: true,
        set: function (exports) {
          moduleObj.default = moduleObj.__useDefault = exports;
        },
        get: function () {
          return moduleObj.__useDefault;
        }
      });
      var require = makeDynamicRequire(link.deps, link.depLoads, seen);

      // evaluate deps first
      if (!link.executingRequire)
        for (var i = 0; i < link.deps.length; i++)
          require(link.deps[i]);

      var output = link.execute.call(global, require, moduleObj.__useDefault, module);
      if (output !== undefined)
        moduleObj.default = moduleObj.__useDefault = output;
      else if (module.exports !== moduleObj.__useDefault)
        moduleObj.default = moduleObj.__useDefault = module.exports;

      var moduleDefault = moduleObj.__useDefault;

      // __esModule flag extension support
      if (moduleDefault && moduleDefault.__esModule)
        for (var p in moduleDefault)
          if (Object.hasOwnProperty.call(moduleDefault, p))
            moduleObj[p] = moduleDefault[p];
    }

    var module = load.module = new Module(link.moduleObj);

    if (!link.setters)
      for (var i = 0; i < load.importerSetters.length; i++)
        load.importerSetters[i](module);

    return module;
  }

  // {} is the closest we can get to call(undefined)
  var nullContext = {};
  if (Object.freeze)
    Object.freeze(nullContext);

  function defineModule (name, module) {
    return registry[name] = {
      key: name,
      module: module,
      importerSetters: [],
      linkRecord: undefined
    };
  }

  return function (mains, depNames, exportDefault, declare) {
    return function (formatDetect) {
      formatDetect(function (deps) {
        var System = {
          _nodeRequire: nodeRequire,
          register: register,
          registerDynamic: registerDynamic,
          registry: {
            get: function (name) {
              return registry[name].module;
            },
            set: defineModule
          },
          newModule: function (module) {
            return new Module(module);
          }
        };

        defineModule('@empty', new Module({}));

        // register external dependencies
        for (var i = 0; i < depNames.length; i++)
          defineModule(depNames[i], createExternalModule(arguments[i], {}));

        // register modules in this bundle
        declare(System);

        // load mains
        var firstLoad = load(mains[0]);
        if (mains.length > 1)
          for (var i = 1; i < mains.length; i++)
            load(mains[i]);

        if (exportDefault)
          return firstLoad.__useDefault;

        if (firstLoad instanceof Module)
          Object.defineProperty(firstLoad, '__esModule', {
            value: true
          });

        return firstLoad;
      });
    };
  };

})((typeof self !== 'undefined') ? self : (typeof global !== 'undefined') ? global : this)
/* (['mainModule'], ['external-dep'], false, function($__System) {
  System.register(...);
})
(function(factory) {
  if (typeof define && define.amd)
    define(['external-dep'], factory);
  // etc UMD / module pattern
})*/
