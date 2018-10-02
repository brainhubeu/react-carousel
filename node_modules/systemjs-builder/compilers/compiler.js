var path = require('path');
var babel = require('babel-core');

function pathToUrl(p) {
  return p.replace(/\\/g, '/');
}

exports.compile = function (load, opts, plugin) {
  var sourceRoot = pathToUrl(path.dirname(load.path) + '/');
  var options = {
    babelrc: false,
    compact: false,
    sourceType: 'script',
    filename: pathToUrl(load.path),
    filenameRelative: path.basename(load.path),
    inputSourceMap: load.metadata.sourceMap,
    moduleId: opts.moduleId,
    sourceFileName: load.path && path.basename(load.path),
    sourceMaps: !!opts.sourceMaps,
    sourceRoot: sourceRoot,
    plugins: [plugin]
  };

  var source = load.metadata.originalSource || load.source;

  var output;
  if (load.metadata.ast) {
    output = babel.transformFromAst(load.metadata.ast, source, options);
  } else {
    output = babel.transform(source, options);
  }

  var sourceMap = output.map;
  if (sourceMap && !sourceMap.sourceRoot) // if input source map doesn't have sourceRoot - add it
    sourceMap.sourceRoot = sourceRoot;

  return Promise.resolve({
    source: output.code,
    sourceMap: sourceMap
  });
};

exports.compileAst = function (load, plugin) {
  return babel.transform(load.source, {
      babelrc: false,
      compact: false,
      filename: load.path,
      inputSourceMap: load.metadata.sourceMap,
      ast: true,
      plugins: [plugin]
    });
};
