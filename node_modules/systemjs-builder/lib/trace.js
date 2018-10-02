var getCanonicalName = require('./utils').getCanonicalName;
var glob = require('glob');
var toFileURL = require('./utils').toFileURL;
var fromFileURL = require('./utils').fromFileURL;
var asp = require('bluebird').promisify;
var fs = require('fs');
var path = require('path');
var extend = require('./utils').extend;
var Promise = require('bluebird');
var getPackage = require('./utils').getPackage;
var getPackageConfigPath = require('./utils').getPackageConfigPath;
var isPackageConfig = require('./utils').isPackageConfig;
var parseCondition = require('./utils').parseCondition;
var serializeCondition = require('./utils').serializeCondition;
var dataUriToBuffer = require('data-uri-to-buffer');

module.exports = Trace;

function Trace(loader, traceCache) {
  // when creating a new trace, we by default invalidate the freshness of the trace cache
  Object.keys(traceCache).forEach(function(canonical) {
    var load = traceCache[canonical];

    if (load && !load.conditional)
      load.fresh = false;
  });


  this.loader = loader;
  // stored traced load records
  this.loads = traceCache || {};
  // in progress traces
  this.tracing = {};
}

/*
 * High-level functions
 */
var namedRegisterRegEx = /(System\.register(Dynamic)?|define)\(('[^']+'|"[^"]+")/g;
Trace.prototype.traceModule = function(moduleName, traceOpts) {
  var loader = this.loader;

  return Promise.resolve(loader.normalize(moduleName))
  .then(function(normalized) {
    return traceCanonical(getCanonicalName(loader, normalized), traceOpts);
  });
};

// given a module, return the conditional environment variation space
Trace.getConditionalEnv = function(builder, loads, traceOpts) {
  var conditionalEnvVariations = {};

  Object.keys(loads).forEach(function(canonical) {
    var load = loads[canonical];
    if (!load.conditional)
      return;

    var envVariations = Trace.getConditionalResolutions(load.conditional, traceOpts.conditions, traceOpts.inlineConditions).conditionalEnvVariations;

    Object.keys(envVariations).forEach(function(condition) {
      if (envVariations[condition] instanceof Array) {
        conditionalEnvVariations[condition] = conditionalEnvVariations[condition] || [];
        envVariations[condition].forEach(function(conditionValue) {
          if (conditionalEnvVariations[condition].indexOf(conditionValue) === -1)
            conditionalEnvVariations[condition].push(conditionValue);
        });
      }
      else {
        conditionalEnvVariations[condition] = conditionalEnvVariations[condition] || envVariations[condition];
      }
    });
  });
  return conditionalEnvVariations;
};

Trace.prototype.traceCanonical = function(canonical, traceOpts) {
  var self = this;

  return self.getAllLoadRecords(canonical, traceOpts, traceOpts.conditions, traceOpts.inlineConditions, {}, [])
  .then(function(loads) {
    // if it is a bundle, we just use a regex to extract the list of loads
    // as "true" records for subtraction arithmetic use only
    var thisLoad = loads[canonical];

    if (thisLoad && !thisLoad.conditional && thisLoad.metadata.bundle) {
      namedRegisterRegEx.lastIndex = 0;
      var curMatch;
      while ((curMatch = namedRegisterRegEx.exec(thisLoad.source)))
        loads[curMatch[3].substr(1, curMatch[3].length - 2)] = true;
    }

    return {
      moduleName: canonical,
      tree: loads
    };
  });
}

function isLoadFresh(load, loader, loads) {
  if (load === undefined)
    return false;

  if (load === false)
    return true;

  if (load.configHash != loader.configHash)
    return false;

  if (load.fresh)
    return true;

  if (load.conditional)
    return false;

  if (load.plugin) {
    if (!loader.pluginLoader.has(loader.pluginLoader.decanonicalize(load.plugin)))
      return false;
  }

  // stat to check freshness
  try {
    var timestamp = fs.statSync(path.resolve(fromFileURL(loader.baseURL), load.path)).mtime.getTime();
  }
  catch(e) {}
  return load.fresh = timestamp == load.timestamp;
}

/*
 * Low-level functions
 */
// runs the pipeline hooks, returning the load record for a module
Trace.prototype.getLoadRecord = function(canonical, traceOpts, parentStack) {
  var loader = this.loader;
  var loads = this.loads;

  if (isLoadFresh(loads[canonical], loader, loads))
    return Promise.resolve(loads[canonical]);

  if (this.tracing[canonical])
    return this.tracing[canonical];

  var self = this;
  var isPackageConditional = canonical.indexOf('/#:') != -1;

  var curMap = loader.map;
  loader.map = {};
  var normalized = loader.decanonicalize(canonical);
  loader.map = curMap;

  return this.tracing[canonical] = Promise.resolve(normalized)
  .then(function(normalized) {
    // modules already set in the registry are system modules
    if (loader.has(normalized))
      return false;

    // package conditional fallback normalization
    if (!isPackageConditional)
      normalized = normalized.replace('/#:', '/');

    // -- conditional load record creation: sourceless intermediate load record --

    // boolean conditional
    var booleanIndex = canonical.lastIndexOf('#?');
    if (booleanIndex != -1) {
      var condition = canonical.substr(booleanIndex + 2);
      if (condition.indexOf('|') == -1)
        condition += '|default';
      return {
        name: canonical,
        fresh: true,
        conditional: {
          condition: condition,
          branch: canonical.substr(0, booleanIndex)
        }
      };
    }

    // package environment conditional
    var pkgEnvIndex = canonical.indexOf('/#:');
    if (pkgEnvIndex != -1) {
      // NB handle a package plugin load here too
      if (canonical.indexOf('!') != -1)
        throw new Error('Unable to trace ' + canonical + ' - building package environment mappings of plugins is not currently supported.');

      var pkgName = canonical.substr(0, pkgEnvIndex);
      var subPath = canonical.substr(pkgEnvIndex + 3);

      var normalizedPkgName = loader.decanonicalize(pkgName);

      // record package config paths
      var loadPackageConfig;
      var packageConfigPath = getPackageConfigPath(loader.packageConfigPaths, normalizedPkgName);
      if (packageConfigPath) {
        loadPackageConfig = getCanonicalName(loader, packageConfigPath);
        (loader.meta[packageConfigPath] = loader.meta[packageConfigPath] || {}).format = 'json';
      }

      // effective analog of the same function in SystemJS packages.js
      // to work out the path with defaultExtension added.
      // we cheat here and use normalizeSync to apply the right checks, while
      // skipping any map entry by temporarily removing it.
      var absURLRegEx = /^[^\/]+:\/\//;
      function isPlain(name) {
        return name[0] != '.' && name[0] != '/' && !name.match(absURLRegEx);
      }
      function getMapMatch(map, name) {
        var bestMatch, bestMatchLength = 0;

        for (var p in map) {
          if (name.substr(0, p.length) == p && (name.length == p.length || name[p.length] == '/')) {
            var curMatchLength = p.split('/').length;
            if (curMatchLength <= bestMatchLength)
              continue;
            bestMatch = p;
            bestMatchLength = curMatchLength;
          }
        }

        return bestMatch;
      }
      function toPackagePath(subPath, isFallback) {
        if (isPlain(subPath)) {
          // plain name -> apply map
          if (!isFallback)
            return loader.normalize(subPath, normalizedPkgName + '/');
          // if a fallback conditional map, only do global map, not package map
          else
            return loader.normalize(subPath);
        }
        else if (subPath == '.') {
          return Promise.resolve(normalizedPkgName);
        }
        else if (subPath.substr(0, 2) == './') {
          var pkgMap = pkg.map;
          pkg.map = {};
          var normalized = loader.normalizeSync(pkgName + '/' + subPath.substr(2));
          pkg.map = pkgMap;
          return Promise.resolve(normalized);
        }
        else {
          return Promise.resolve(normalized);
        }
      }

      var pkg
      var envMap;
      var metadata = {};

      // ensure we have loaded any package config first
      // NB this does not properly deal with package config file invalidation
      // we should handle some kind of invalidation process where a package config file change
      // must invalidate all load records as we can't know the scope of the normalization changes
      return loader.normalize(normalizedPkgName)
      .then(function() {
        pkg = loader.packages[normalizedPkgName];

        var mapMatch = getMapMatch(pkg.map, subPath);
        envMap = pkg.map[mapMatch];

        if (!envMap)
          throw new Error('Package conditional ' + canonical + ' has no package conditional map present.');

        // resolve the fallback
        return toPackagePath(subPath, true);
      })
      .then(function(resolvedPath) {
        // if the fallback is itself a conditional then use that directly
        if (resolvedPath.match(/\#[\:\?\{]/))
          return getCanonicalName(loader, resolvedPath);

        // if the fallback is a system module then that is it
        if (isPlain(resolvedPath))
          return resolvedPath;

        return loader.locate({ name: resolvedPath, metadata: metadata })
        .then(function(address) {
          // allow build: false trace opt-out
          if (metadata.build === false)
            return false;

          // check if the fallback exists
          return new Promise(function(resolve) {
            fs.exists(fromFileURL(address), resolve);
          })
          .then(function(fallbackExists) {
            if (fallbackExists)
              return getCanonicalName(loader, resolvedPath);
          });
        });
      })
      .then(function(fallback) {
        // environment trace
        return Promise.all(Object.keys(envMap).map(function(envCondition) {
          var mapping = envMap[envCondition];
          var conditionObj = parseCondition(envCondition);

          return loader.normalize(conditionObj.module, normalizedPkgName)
          .then(function(conditionModule) {
            conditionObj.module = getCanonicalName(loader, conditionModule);
            pkg = loader.packages[normalizedPkgName];
            return toPackagePath(mapping, false);
          })
          .then(function(normalizedMapping) {
            return {
              condition: serializeCondition(conditionObj),
              branch: getCanonicalName(loader, normalizedMapping)
            };
          });
        }))
        .then(function(envs) {
          return {
            name: canonical,
            fresh: true,
            packageConfig: loadPackageConfig,
            conditional: {
              envs: envs,
              fallback: fallback
            }
          };
        });
      });
    }

    // conditional interpolation
    var interpolationRegEx = /#\{[^\}]+\}/;
    var interpolationMatch = canonical.match(interpolationRegEx);
    if (interpolationMatch) {
      var condition = interpolationMatch[0].substr(2, interpolationMatch[0].length - 3);

      if (condition.indexOf('|') == -1)
        condition += '|default';

      var metadata = {};
      return Promise.resolve(loader.locate({ name: normalized.replace(interpolationRegEx, '*'), metadata: metadata }))
      .then(function(address) {
        if (address.substr(0, 8) != 'file:///' && !load.metadata.loader)
          metadata.build = false;

        // allow build: false trace opt-out
        if (metadata.build === false)
          return false;

        // glob the conditional interpolation variations from the filesystem
        var globIndex = address.indexOf('*');
        return asp(glob)(fromFileURL(address), { dot: true, nobrace: true, noglobstar: true, noext: true, nodir: true })
        .then(function(paths) {
          var branches = {};
          paths.forEach(function(path) {
            path = toFileURL(path);

            var pathCanonical = getCanonicalName(loader, path);
            var interpolate = pathCanonical.substr(interpolationMatch.index, path.length - address.length + 1);

            if (normalized.indexOf('!') != -1) {
              if (loader.pluginFirst)
                pathCanonical = getCanonicalName(loader, metadata.loader) + '!' + pathCanonical;
              else
                pathCanonical = pathCanonical + '!' + getCanonicalName(loader, metadata.loader);
            }
            branches[interpolate] = pathCanonical;
          });

          // if the condition values have been provided via traceOpts.conditions
          // then add these to the glob variations as well
          if (traceOpts.conditions[condition])
            traceOpts.conditions[condition].forEach(function(c) {
              if (branches[c])
                return;
              var branchCanonical = canonical.substr(0, interpolationMatch.index) + c + canonical.substr(interpolationMatch[0].length + interpolationMatch.index);
              branches[c] = branchCanonical;
            });

          return {
            name: canonical,
            fresh: false, // we never cache conditional interpolates and always reglob
            conditional: {
              condition: condition,
              branches: branches
            }
          };
        });
      });
    }

    // -- trace loader hooks --
    var load = {
      name: canonical,
      // baseURL-relative path to address
      path: null,
      metadata: {},
      deps: [],
      depMap: {},
      source: null,

      // this is falsified by builder.reset to indicate we should restat
      fresh: true,
      // timestamp from statting the underlying file source at path
      timestamp: null,
      // each load stores a hash of the configuration from the time of trace
      // configHash is set by the loader.config function of the builder
      configHash: loader.configHash,

      plugin: null,
      runtimePlugin: false,

      // plugins via syntax must build in the plugin package config
      pluginConfig: null,

      // packages have a config file that must be built in for bundles
      packageConfig: null,
      isPackageConfig: isPackageConfig(loader, canonical),

      // these are only populated by the separate builder.getDeferredImports(tree) method
      deferredImports: null,

      // in the case of Rollup, a single load can represent several compacted loads
      compactedLoads: null,
    };
    var curHook = 'locate';
    var originalSource;
    return Promise.resolve(loader.locate({ name: normalized, metadata: load.metadata}))
    .then(function(address) {
      curHook = '';

      if (address.substr(0, 8) != 'file:///' && !load.metadata.loader)
        load.metadata.build = false;

      // build: false build config - null load record
      if (load.metadata.build === false)
        return false;

      if (address.substr(0, 8) == 'file:///')
        load.path = path.relative(fromFileURL(loader.baseURL), fromFileURL(address));

      return Promise.resolve()
      .then(function() {
        // set load.plugin to canonical plugin name if a plugin load
        if (load.metadata.loaderModule)
          return Promise.resolve(loader.pluginLoader.normalize(load.metadata.loader, normalized))
          .then(function(pluginNormalized) {
            load.plugin = getCanonicalName(loader, pluginNormalized);

            if (load.metadata.loaderModule &&
                (load.metadata.loaderModule.build === false || Object.keys(load.metadata.loaderModule).length == 0 ||
                (typeof load.metadata.loaderModule === 'function' || load.metadata.loaderModule.toString && load.metadata.loaderModule.toString() === 'Module' && typeof load.metadata.loaderModule.default === 'function')))
              load.runtimePlugin = true;

            if (pluginNormalized.indexOf('!') == -1 && !load.runtimePlugin && getPackage(loader.packages, pluginNormalized)) {
              var packageConfigPath = getPackageConfigPath(loader.packageConfigPaths, pluginNormalized);
              if (packageConfigPath) {
                load.pluginConfig = getCanonicalName(loader, packageConfigPath);
                (loader.meta[packageConfigPath] = loader.meta[packageConfigPath] || {}).format = 'json';
              }
            }
          });
      })
      .then(function() {
        if (load.runtimePlugin)
          return load;

        curHook = 'fetch';


        return loader
          .fetch({ name: normalized, metadata: load.metadata, address: address })

          // Parse source map definitions inside of the source and apply it to the metadata if present.
          .then(function (source) {
            if (!traceOpts.sourceMaps || load.metadata.sourceMap)
              return source;

            // Search for the specified sourceMap definition in the files source.
            var sourceMap = source.match(/^\s*\/\/\s*[#@] sourceMappingURL=([^\s'"]*)/m);

            if (!sourceMap)
              return source;

            // Once the sourceMappingURL starts with `data:`, we have to parse it as an inline source map.
            if (sourceMap[1].startsWith('data:')) {
              load.metadata.sourceMap = JSON.parse(dataUriToBuffer(sourceMap[1]).toString('utf8'));
              return source;
            } else {
              // Retrieve the path of the sourceMappingURL in relative to the
              // relative path to the .map file
              var sourceMapPath = path.join(path.dirname(fromFileURL(address)), sourceMap[1]);

              return asp(fs.readFile)(sourceMapPath, 'utf8').then(function (sourceMap) {
                load.metadata.sourceMap = JSON.parse(sourceMap);
                return source;
              })
              // dont let a missing source map fail the entire build
              .catch(function() {
                return source;
              });
            }
          })

        .then(function(source) {
          if (typeof source != 'string')
            throw new TypeError('Loader fetch hook did not return a source string');
          originalSource = source;
          curHook = 'translate';

          // default loader fetch hook will set load.metadata.timestamp
          if (load.metadata.timestamp) {
            load.timestamp = load.metadata.timestamp;
            load.metadata.timestamp = undefined;
          }

          return loader.translate({ name: normalized, metadata: load.metadata, address: address, source: source }, traceOpts);
        })
        .then(function(source) {

          load.source = source;
          curHook = 'dependency parsing';

          return loader.instantiate({ name: normalized, metadata: load.metadata, address: address, source: source });
        })
        .then(function(result) {

          // allow late build opt-out
          if (load.metadata.build === false)
            return;

          curHook = '';
          if (!result)
            throw new TypeError('Native ES Module builds not supported. Ensure transpilation is included in the loader pipeline.');

          load.deps = result.deps;

          // legacy es module transpilation translates to get the dependencies, so we need to revert for re-compilation
          if (load.metadata.format == 'esm' && load.metadata.originalSource)
            load.source = originalSource;

          // record package config paths
          if (getPackage(loader.packages, normalized) && !load.isPackageConfig) {
            var packageConfigPath = getPackageConfigPath(loader.packageConfigPaths, normalized);
            if (packageConfigPath) {
              load.packageConfig = getCanonicalName(loader, packageConfigPath);
              (loader.meta[packageConfigPath] = loader.meta[packageConfigPath] || {}).format = 'json';
            }
          }

          // normalize dependencies to populate depMap
          return Promise.all(result.deps.map(function(dep) {
            return loader.normalize(dep, normalized, address)
            .then(function(normalized) {
              try {
                load.depMap[dep] = getCanonicalName(loader, normalized);
              }
              catch(e) {
                if (!traceOpts.excludeURLs || normalized.substr(0, 7) == 'file://')
                  throw e;
                load.depMap[dep] = normalized;
              }
            });
          }));
        });
      })
      .catch(function(err) {
        var msg = (curHook ? ('Error on ' + curHook + ' for ') : 'Error tracing ') + canonical + ' at ' + normalized;

        if (parentStack)
          parentStack.reverse().forEach(function(parent) {
            msg += '\n\tLoading ' + parent;
          });

        // rethrow loader hook errors with the hook information
        var newMsg = msg + '\n\t' + (err.message || err);
        var newErr = new Error(newMsg, err.fileName, err.lineNumber);
        newErr.originalErr = err.originalErr || err;
        newErr.stack = msg + '\n\t' + (err.stack || err);
        throw newErr;
      })
      .then(function() {
        // format: 'system' as primary detector
        if (load.metadata.format === 'register')
          load.metadata.format = 'system';

        // remove unnecessary metadata for trace
        load.metadata.entry = undefined;
        load.metadata.builderExecute = undefined;
        load.metadata.parseTree = undefined;
        load.metadata.ast = undefined;

        if (load.metadata.build === false)
          return false;

        return load;
      });
    });
  })
  .then(function(load) {
    self.tracing[canonical] = undefined;
    return loads[canonical] = load;
  }).catch(function(err) {
    self.tracing[canonical] = undefined;
    throw err;
  });
};

/*
 * Returns the full trace tree of a module
 *
 * - conditionalEnv represents the conditional tracing environment module values to impose on the trace
 * -
 *
 * conditionalEnv provides canonical condition tracing rules of the form:
 *
 *  {
 *    'some/interpolation|value': true, // include ALL variations
 *    'another/interpolation|value': false, // include NONE
 *    'custom/interpolation|value': ['specific', 'values']
 *
 *    // default BOOLEAN entry::
 *    '@system-env|browser': false,
 *    '@system-env|~browser': false
 *
 *    // custom boolean entry
 *    // boolean only checks weak truthiness to allow overlaps
 *    '@system-env|~node': true
 *  }
 *
 */
var systemModules = ['@empty', '@system-env', '@@cjs-helpers', '@@global-helpers'];
Trace.prototype.getAllLoadRecords = function(canonical, traceOpts, canonicalConditionalEnv, canonicalInlineConditionals, curLoads, parentStack) {
  var loader = this.loader;

  curLoads = curLoads || {};

  if (canonical in curLoads)
    return curLoads;

  var self = this;
  return this.getLoadRecord(canonical, traceOpts, parentStack)
  .then(function(load) {

    // check this again – might have been loaded asynchronously since the last check
    if (canonical in curLoads)
      return curLoads;

    // conditionals, build: false and system modules are falsy loads in the trace trees
    // (that is, part of depcache, but not built)
    // we skip system modules though
    if (systemModules.indexOf(canonical) == -1)
      curLoads[canonical] = load;

    if (load) {
      parentStack = parentStack.concat([canonical]);
      return Promise.all(Trace.getLoadDependencies(load, traceOpts, canonicalConditionalEnv, canonicalInlineConditionals).map(function(dep) {
        return self.getAllLoadRecords(dep, traceOpts, canonicalConditionalEnv, canonicalInlineConditionals, curLoads, parentStack);
      }));
    }
  })
  .then(function() {
    return curLoads;
  });
};

function conditionalComplement(condition) {
  var conditionObj = parseCondition(condition);
  conditionObj.negate = !conditionObj.negate;
  return serializeCondition(conditionObj);
}

Trace.toCanonicalConditionalEnv = toCanonicalConditionalEnv;
function toCanonicalConditionalEnv(loader, conditionalEnv) {
  var canonicalConditionalEnv = {};

  // convert boolean conditions of the form
  // @system-env|browser: [true, false]
  // @system-env|~browser: true
  // into just:
  // @system-env|browser: [true, false]
  // to be deprecated in due course
  Object.keys(conditionalEnv).map(function(m) {
    var conditionObj = parseCondition(m);

    if (!(conditionalEnv[m] instanceof Array)) {
      if (!conditionObj.negate) {
        conditionalEnv[m] = [conditionalEnv[m]];
      }
      else {
        var complement = conditionalComplement(m);
        if (conditionalEnv[complement]) {
          if (conditionalEnv[complement] instanceof Array) {
            if (conditionalEnv[complement].indexOf(!conditionalEnv[m]) === -1)
              conditionalEnv[complement].push(!conditionalEnv[m]);
          }
          else {
            if (!conditionalEnv[m] !== conditionalEnv[complement])
              conditionalEnv[conditionalComplement(m)] = [conditionalEnv[conditionalComplement(m)], !conditionalEnv[m]];
          }
        }
        else {
          conditionalEnv[conditionalComplement(m)] = [!conditionalEnv[m]];
        }
        delete conditionalEnv[m];
      }
    }
  });

  return Promise.all(Object.keys(conditionalEnv).map(function(m) {
    var conditionObj = parseCondition(m);
    return loader.normalize(conditionObj.module)
    .then(function(normalized) {
      conditionObj.module = getCanonicalName(loader, normalized);
      var canonicalCondition = serializeCondition(conditionObj);
      canonicalConditionalEnv[canonicalCondition] = conditionalEnv[m];
    });
  }))
  .then(function() {
    return canonicalConditionalEnv;
  });
}

/*
 * to support static conditional builds, we use the conditional tracing options
 * to inline resolved conditions for the trace
 * basically rewriting the tree without any conditionals
 * where conditions are still present or conflicting we throw an error
 */
Trace.prototype.inlineConditions = function(tree, loader, traceOpts) {
  var self = this;

  var inconsistencyErrorMsg = 'For static condition inlining only an exact environment resolution can be built, pending https://github.com/systemjs/builder/issues/311.';

  // ensure we have no condition conflicts
  for (var c in traceOpts.inlineConditions) {
    if (traceOpts.inlineConditions[c].length > 1)
      throw new TypeError('Error building condition ' + c + '. ' + inconsistencyErrorMsg);
  }

  var conditionalResolutions = {};
  var importsSystemEnv = false;

  // get the list of all conditional dependencies in the tree
  var allConditionals = [];
  Object.keys(tree).forEach(function(m) {
    if (m.match(/#[\:\?\{]/) && allConditionals.indexOf(m) === -1)
      allConditionals.push(m);

    if (!tree[m] || tree[m].conditional)
      return;

    Object.keys(tree[m].depMap).forEach(function(d) {
      var dep = tree[m].depMap[d];

      if (dep.match(/#[\:\?\{]/) && allConditionals.indexOf(dep) === -1)
        allConditionals.push(dep);
    });
  });

  // determine the conditional resolutions
  return Promise.all(allConditionals.map(function(c) {
    return self.getLoadRecord(c, traceOpts)
    .then(function(load) {
      var branches = Trace.getConditionalResolutions(load.conditional, traceOpts.conditions, traceOpts.inlineConditions).branches;

      if (branches.length === 1)
        conditionalResolutions[c] = branches[0];
    });
  }))
  .then(function() {
    // resolve any chained conditionals
    Object.keys(conditionalResolutions).forEach(function(c) {
      var resolution = conditionalResolutions[c];

      var seen = [];
      while (conditionalResolutions[resolution] && seen.indexOf(resolution) == -1) {
        seen.push(resolution);
        resolution = conditionalResolutions[resolution];
        conditionalResolutions[c] = resolution;
      }
      if (seen.indexOf(resolution) != -1)
        throw new Error('Circular conditional resolution ' + seen.join(' -> ') + ' -> ' + resolution);
    });

    // finally we do a deep clone of the tree, applying the conditional resolutions as we go
    // if we have a dependency on a condition not in the tree, we throw as it would be an unresolved external
    var inlinedTree = {};
    Object.keys(tree).forEach(function(m) {
      var load = tree[m];

      if (typeof load == 'boolean') {
        inlinedTree[m] = load;
        return;
      }

      if (load.conditional)
        return;

      var clonedLoad = extend({}, load);
      clonedLoad.depMap = {};
      Object.keys(load.depMap).forEach(function(d) {
        var normalizedDep = load.depMap[d];

        normalizedDep = conditionalResolutions[normalizedDep] || normalizedDep;

        if (normalizedDep == '@system-env')
          importsSystemEnv = true;

        clonedLoad.depMap[d] = normalizedDep;
      });

      inlinedTree[m] = clonedLoad;
    });

    // if we explicitly import from the system environment, then we need to build it into a static build
    // this is normally excluded as it is a system module in SystemJS but won't be available in static
    // builds which is exactly what this function acts on
    if (importsSystemEnv) {
      inlinedTree['@system-env'] = {
        name: '@system-env',
        path: null,
        metadata: {
          format: 'json'
        },
        deps: [],
        depMap: {},
        source: JSON.stringify({
          production: traceOpts.inlineConditions['@system-env|production'],
          browser: traceOpts.inlineConditions['@system-env|browser'],
          node: traceOpts.inlineConditions['@system-env|node'],
          dev: traceOpts.inlineConditions['@system-env|dev'],
          default: true
        }),
        fresh: true,
        timestamp: null,
        configHash: loader.configHash,
      };
    }

    return inlinedTree;
  });
};

/*
 * Given a conditional load record, a conditional environment, and an inline conditional environment
 * returns the list of possible conditional branch outcomes, the condition modules necessary
 * in runtime to determine non-inlined conditions and the conditionalEnvVariations
 * object representing the resultant condition space
 */
Trace.getConditionalResolutions = function(conditional, conditionalEnv, inlineConditionals) {
  // flatten all conditions into a filtered array of condition, module branches
  var branches = [];
  var conditionModules = [];
  var conditionalEnvVariations = {};

  function traceCondition(condition, value) {
    var conditionModule = parseCondition(condition).module;

    if (inlineConditionals[condition])
      return inlineConditionals[condition][0] === value;

    if (conditionalEnv[condition] && conditionalEnv[condition].indexOf(value) === -1)
      return false;

    conditionalEnvVariations[condition] = conditionalEnvVariations[condition] || [];
    if (conditionalEnvVariations[condition].indexOf(value) === -1)
      conditionalEnvVariations[condition].push(value);

    if (conditionModules.indexOf(conditionModule) == -1)
      conditionModules.push(conditionModule);

    return true;
  }

  // whether or not to include condition branch given our conditionalEnv
  function booleanEnvTrace(condition) {
    var conditionObj = parseCondition(condition);

    if (conditionObj.negate)
      return traceCondition(conditionalComplement(condition), false);
    else
      return traceCondition(condition, true);
  }

  // { condition, branch } boolean conditional
  if (conditional.branch) {
    branches.push(booleanEnvTrace(conditional.condition) ? conditional.branch: '@empty');
  }

  // { envs: [{condition, branch},...], fallback } package environment map
  else if (conditional.envs) {
    var doFallback = true;
    conditional.envs.forEach(function(env) {
      if (doFallback && booleanEnvTrace(env.condition))
        branches.push(env.branch);

      // if we're specifically not tracing the negative of this condition
      // then we stop the fallback branch from building
      if (!booleanEnvTrace(conditionalComplement(env.condition)))
        doFallback = false;
    });
    if (doFallback && conditional.fallback)
      branches.push(conditional.fallback);
  }

  // { condition, branches } conditional interpolation
  else if (conditional.branches) {
    Object.keys(conditional.branches).forEach(function(branch) {
      if (traceCondition(conditional.condition, branch))
        branches.push(conditional.branches[branch]);
    });
  }

  return {
    branches: branches,
    conditionModules: conditionModules,
    conditionalEnvVariations: conditionalEnvVariations
  };
};

// Returns the ordered immediate dependency array from the trace of a module
Trace.getLoadDependencies = function(load, traceOpts, canonicalConditionalEnv, canonicalInlineConditionals) {
  canonicalConditionalEnv = canonicalConditionalEnv || {};

  var deps = [];

  // conditional load records have their branches all included in the trace
  if (load.conditional) {
    var resolutions = Trace.getConditionalResolutions(load.conditional, canonicalConditionalEnv, canonicalInlineConditionals);

    if (traceOpts.tracePackageConfig && load.packageConfig)
      deps.push(load.packageConfig);

    resolutions.conditionModules.forEach(function(conditionModule) {
      if (deps.indexOf(conditionModule) == -1)
        deps.push(conditionModule);
    });

    return deps.concat(resolutions.branches);
  }

  // trace the plugin as a dependency
  if (traceOpts.traceRuntimePlugin && load.runtimePlugin)
    deps.push(load.plugin);

  // plugins by syntax build in their config
  if (traceOpts.tracePackageConfig && load.pluginConfig)
    deps.push(load.pluginConfig);

  // add the dependencies
  load.deps.forEach(function(dep) {
    deps.push(load.depMap[dep]);
  });

  // trace the package config if necessary
  if (traceOpts.tracePackageConfig && load.packageConfig)
    deps.push(load.packageConfig);

  return deps;
};
