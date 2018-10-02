(function (global) {
  var loader = $__System;

  function readMemberExpression (p, value) {
    var pParts = p.split('.');
    while (pParts.length)
      value = value[pParts.shift()];
    return value;
  }

  function getGlobalValue (exports) {
    if (typeof exports == 'string')
      return readMemberExpression(exports, global);

    if (!(exports instanceof Array))
      throw new Error('Global exports must be a string or array.');

    var globalValue = {};
    for (var i = 0; i < exports.length; i++)
      globalValue[exports[i].split('.').pop()] = readMemberExpression(exports[i], global);
    return globalValue;
  }

  // bare minimum ignores
  var ignoredGlobalProps = ['_g', 'sessionStorage', 'localStorage', 'clipboardData', 'frames', 'frameElement', 'external',
      'mozAnimationStartTime', 'webkitStorageInfo', 'webkitIndexedDB', 'mozInnerScreenY', 'mozInnerScreenX'];

  var globalSnapshot;
  function globalIterator (globalName) {
    if (ignoredGlobalProps.indexOf(globalName) !== -1)
      return;
    try {
      var value = global[globalName];
    }
    catch (e) {
      ignoredGlobalProps.push(globalName);
    }
    this(globalName, value);
  }

  loader.registry.set('@@global-helpers', loader.newModule({
    prepareGlobal: function (moduleName, exports, globals) {
      // disable module detection
      var curDefine = global.define;
      global.define = undefined;

      // set globals
      var oldGlobals;
      if (globals) {
        oldGlobals = {};
        for (var g in globals) {
          oldGlobals[g] = global[g];
          global[g] = globals[g];
        }
      }

      // store a complete copy of the global object in order to detect changes
      if (!exports) {
        globalSnapshot = {};

        Object.keys(global).forEach(globalIterator, function (name, value) {
          globalSnapshot[name] = value;
        });
      }

      // return function to retrieve global
      return function () {
        var globalValue = exports ? getGlobalValue(exports) : {};

        var singleGlobal;
        var multipleExports = !!exports;

        if (!exports)
          Object.keys(global).forEach(globalIterator, function (name, value) {
            if (globalSnapshot[name] === value)
              return;
            if (value === undefined)
              return;

            if (!exports) {
              globalValue[name] = value;

              if (singleGlobal !== undefined) {
                if (!multipleExports && singleGlobal !== value)
                  multipleExports = true;
              }
              else {
                singleGlobal = value;
              }
            }
          });

        globalValue = multipleExports ? globalValue : singleGlobal;

        // revert globals
        if (oldGlobals) {
          for (var g in oldGlobals)
            global[g] = oldGlobals[g];
        }
        global.define = curDefine;

        return globalValue;
      };
    }
  }));
})((typeof self !== 'undefined') ? self : (typeof global !== 'undefined') ? global : this)
