"use strict";

/*
 * HashedChunkIdsPlugin
 * source https://github.com/webpack/webpack/blob/376badba98d5323bfb342e8b2c438fc3dcc4954b/lib/NamedChunksPlugin.js
 */

var getHashFn = require(`./get-hash-fn`);

function HashedChunkIdsPlugin(options) {
  this.options = options || {};
}

HashedChunkIdsPlugin.prototype.apply = function apply(compiler) {
  var hashFn = getHashFn(this.options);
  compiler.plugin(`compilation`, function (compilation) {
    compilation.plugin(`before-chunk-ids`, function (chunks) {
      chunks.forEach(function (chunk) {
        if (chunk.id === null) {
          if (typeof chunk.name !== `undefined` && chunk.name !== null) {
            chunk.id = hashFn(chunk.name);
          }
        }
      });
    });
  });
};

module.exports = HashedChunkIdsPlugin;
//# sourceMappingURL=hashed-chunk-ids-plugin.js.map