"use strict";

var fs = require(`fs-extra`);
var chokidar = require(`chokidar`);
var nodePath = require(`path`);

module.exports = function () {
  chokidar.watch(`${process.cwd()}/static`).on(`add`, function (path) {
    var relativePath = nodePath.relative(`${process.cwd()}/static`, path);
    fs.copy(path, `${process.cwd()}/public/${relativePath}`);
  }).on(`change`, function (path) {
    var relativePath = nodePath.relative(`${process.cwd()}/static`, path);
    fs.copy(path, `${process.cwd()}/public/${relativePath}`);
  });
};
//# sourceMappingURL=copy-static-directory.js.map