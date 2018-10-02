var sourceMap = require('source-map');
var path = require('path');
var fs = require('fs');

var toFileURL = require('./utils').toFileURL;
var fromFileURL = require('./utils').fromFileURL;

var wrapSourceMap = function(map) {
  return new sourceMap.SourceMapConsumer(map);
};

var sourceMapRegEx = /^\s*\/\/[@#] ?(sourceURL|sourceMappingURL)=([^\n'"]+)/m;
exports.removeSourceMaps = function(source) {
  return source.replace(sourceMapRegEx, '');
};

function getMapObject(map) {
  if (typeof map != 'string')
    return map;

  try {
    return JSON.parse(map);
  }
  catch(error) {
    throw new Error('Invalid JSON: ' + map);
  }
}

function isFileURL(url) {
  return url.substr(0, 8) == 'file:///';
}

exports.concatenateSourceMaps = function(outFile, mapsWithOffsets, basePath, sourceMapContents) {
  var generated = new sourceMap.SourceMapGenerator({
    file: path.basename(outFile)
  });

  var outPath = path.dirname(outFile);

  var contentsBySource = sourceMapContents ? {} : null;

  mapsWithOffsets.forEach(function(pair) {
    var offset = pair[0];
    var map = getMapObject(pair[1]);

    if (sourceMapContents && map.sourcesContent) {
      for (var i=0; i<map.sources.length; i++) {

        // If the source is an absolute path or file URL, use it as-is, otherwise prepend the sourceRoot.
        var isAbsoluteOrFileUrl = path.isAbsolute(map.sources[i]) || isFileURL(map.sources[i]);
        var source = isAbsoluteOrFileUrl ? map.sources[i] : (map.sourceRoot || '') + map.sources[i];

        // If the source is still not a file URL, normalize the path.
        if (!isFileURL(source))
        {
          source = path.normalize(source).replace(/\\/g, '/');
        }
        
        if (!source.match(/\/@traceur/)) {
          if (!contentsBySource[source]) {
            contentsBySource[source] = map.sourcesContent[i];
          } else {
            if (contentsBySource[source] != map.sourcesContent[i]) {
              throw new Error("Mismatched sourcesContent for: " + source);
            }
          }
        }
      }
    }

    wrapSourceMap(map).eachMapping(function(mapping) {
      if (mapping.originalLine == null || mapping.originalColumn == null || !mapping.source || mapping.source.match(/(\/|^)@traceur/))
        return;

      generated.addMapping({
        generated: {
          line: offset + mapping.generatedLine,
          column: mapping.generatedColumn
        },
        original: {
          line: mapping.originalLine,
          column: mapping.originalColumn
        },
        source: mapping.source,
        name: mapping.name
      });
    });
  });

  // normalize source paths and inject sourcesContent if necessary
  var normalized = JSON.parse(JSON.stringify(generated));

  if (sourceMapContents) {
    normalized.sourcesContent = normalized.sources.map(function(source) {
      if (contentsBySource[source])
        return contentsBySource[source];

      try {
        return fs.readFileSync(path.resolve(basePath, source)).toString();
      }
      catch (e) {
        return "";
      }
    });
  }

  normalized.sources = normalized.sources.map(function(source) {
    var isRootRelative = /^[\\/]/.test(source);

    if (isFileURL(source))
      source = fromFileURL(source);

    // If the source is not already a root-relative path, make it relative to the outPath.
    if (!isRootRelative)
      source = path.relative(outPath, path.resolve(basePath, source));

    return source.replace(/\\/g, '/');
  });

  return JSON.stringify(normalized);
};
