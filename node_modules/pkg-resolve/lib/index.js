"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = resolve;

var _jspm = require("jspm");

var _jspm2 = _interopRequireDefault(_jspm);

var _resolve = require("resolve");

var _resolve2 = _interopRequireDefault(_resolve);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _process = require("process");

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jspmLoader = null;
try {
  jspmLoader = _jspm2.default.Loader();
} catch (ex) {}

function packageFilter(pkg) {
  if (pkg.style) {
    pkg.main = pkg.style;
  }

  // Prefer ES6 Modules
  if (pkg["jsnext:main"]) {
    pkg.main = pkg["jsnext:main"];
  }

  return pkg;
}

function resolve(id, opts) {
  // This is required because JSPM does not return files based on "main" or "style"
  // attributes from "package.json" but expect this in most cases.
  var resolveFile = function resolveFile(path, resolveCallback, rejectCallback) {
    (0, _resolve2.default)(".", {
      basedir: path,
      extensions: [".js", ".css", ".scss", ".sss", ".sass", ".less", ".woff2", ".woff", ".ttf", ".otf", ".eot", ".svg", ".png", ".jpeg", ".webp"],
      packageFilter: packageFilter
    }, function (err, result) {
      if (err) {
        rejectCallback(err);
      } else {
        resolveCallback(result);
      }
    });
  };

  return new Promise(function (resolveCallback, rejectCallback) {
    var basedir = opts && opts.basedir || _process2.default.cwd();
    (0, _resolve2.default)(id, {
      basedir: basedir,
      packageFilter: packageFilter
    }, function (err, npmResult) {
      if (err) {
        if (!jspmLoader) {
          return rejectCallback(err);
        }

        var isFileRequest = id.indexOf("/") !== -1;
        var idFileExt = isFileRequest && _path2.default.extname(id) || null;

        // console.log("NPM Lookup Failed: ", err);
        jspmLoader.normalize(id).then(function (jspmResult) {
          // Convert to non-url real usable file system path
          jspmResult = jspmResult.replace("file://", "");

          // The JSPM normalization falls back to working directory + ID even if the
          // file / directory does not exist.
          _fs2.default.lstat(jspmResult, function (err, statResult) {
            if (err) {
              var resolvedExt = _path2.default.extname(jspmResult);
              if (idFileExt !== resolvedExt) {
                var _ret = function () {
                  var jspmResultFixed = jspmResult.slice(0, -resolvedExt.length);
                  _fs2.default.lstat(jspmResultFixed, function (err) {
                    if (err) {
                      rejectCallback(err);
                    } else {
                      resolveCallback(jspmResultFixed);
                    }
                  });

                  return {
                    v: void 0
                  };
                }();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
              }

              rejectCallback("No such file or directory: " + jspmResult);
            } else {
              var resolvedToFile = statResult.isFile();
              if (!resolvedToFile) {
                return resolveFile(jspmResult, resolveCallback, rejectCallback);
              }

              resolveCallback(jspmResult);
            }
          });
        }).catch(function (jspmError) {
          rejectCallback(jspmError);
        });
      } else {
        resolveCallback(npmResult);
      }
    });
  });
}
//# sourceMappingURL=index.js.map