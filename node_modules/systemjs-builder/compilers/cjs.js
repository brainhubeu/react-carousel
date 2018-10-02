var compiler = require('./compiler');

exports.compile = function (load, opts, loader) {

  opts.moduleId = !opts.anonymous && load.name;

  var deps = opts.normalize ? load.deps.map(function (dep) { return load.depMap[dep]; }) : load.deps;

  // send normalized globals into the transformer
  var normalizedGlobals;
  if (load.metadata.globals) {
    normalizedGlobals = {};
    for (var g in load.metadata.globals)
      normalizedGlobals[g] = opts.normalize ? load.depMap[load.metadata.globals[g]] : load.metadata.globals[g];
  }

  // remove loader base url from path
  var path;
  if (opts.static) {
    path = load.path;
    if (path.substr(0, loader.baseURL.length) == loader.baseURL)
      path = path.substr(loader.baseURL.length);
  }

  return compiler.compile(load, opts, [require('babel-plugin-transform-cjs-system-wrapper').default, {
    deps: deps,
    globals: normalizedGlobals,
    optimize: opts.production,
    map: function(dep) {
      return opts.normalize ? load.depMap[dep] : dep;
    },
    path: path,
    static: opts.static,
    systemGlobal: opts.systemGlobal,
    esModule: load.metadata.esModule
  }]);
};
