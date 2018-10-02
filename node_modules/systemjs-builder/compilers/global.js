var compiler = require('./compiler');

exports.compile = function (load, opts, loader) {
  var deps = opts.normalize ? load.deps.map(function(dep) { return load.depMap[dep]; }) : load.deps;

  // send normalized globals into the transformer
  var normalizedGlobals;
  if (load.metadata.globals) {
    normalizedGlobals = {};
    for (var g in load.metadata.globals)
      normalizedGlobals[g] = opts.normalize ? load.depMap[load.metadata.globals[g]] : load.metadata.globals[g];
  }

  return compiler.compile(load, opts, [require('babel-plugin-transform-global-system-wrapper').default, {
    deps: deps,
    exportName: load.metadata.exports,
    globals: normalizedGlobals,
    moduleName: !opts.anonymous && load.name,
    systemGlobal: opts.systemGlobal,
    esModule: load.metadata.esModule
  }]);
};

exports.sfx = function(loader) {
  return require('fs').readFileSync(require('path').resolve(__dirname, '../templates/global-helpers.min.js')).toString();
};
