"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globCB = require(`glob`);
var Promise = require(`bluebird`);
var _ = require(`lodash`);
var chokidar = require(`chokidar`);
var systemPath = require(`path`);

var glob = Promise.promisify(globCB);

var validatePath = require(`./validate-path`);

// Path creator.
// Auto-create layouts.
// algorithm is glob /layouts directory for js/jsx/cjsx files *not*
// underscored
exports.createLayouts = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref, options, doneCb) {
    var store = _ref.store,
        boundActionCreators = _ref.boundActionCreators;
    var createLayout, deleteLayout, program, exts, layoutDirectory, layoutGlob, files;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createLayout = boundActionCreators.createLayout, deleteLayout = boundActionCreators.deleteLayout;
            program = store.getState().program;
            exts = program.extensions.map(function (e) {
              return `${e.slice(1)}`;
            }).join(`,`);
            layoutDirectory = systemPath.posix.join(program.directory, `/src/layouts`);
            layoutGlob = `${layoutDirectory}/**/*.{${exts}}`;

            // Get initial list of files.

            _context.next = 7;
            return glob(layoutGlob);

          case 7:
            files = _context.sent;

            files.forEach(function (file) {
              return _createLayout(file, layoutDirectory, createLayout);
            });

            // Listen for new layouts to be added or removed.
            chokidar.watch(layoutGlob).on(`add`, function (path) {
              if (!_.includes(files, path)) {
                _createLayout(path, layoutDirectory, createLayout);
                files.push(path);
              }
            }).on(`unlink`, function (path) {
              // Delete the layout for the now deleted component.
              store.getState().layouts.filter(function (p) {
                return p.component === path;
              }).forEach(function (layout) {
                deleteLayout({ name: layout.name });
                files = files.filter(function (f) {
                  return f !== layout.name;
                });
              });
            }).on(`ready`, function () {
              return doneCb();
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var _createLayout = function _createLayout(filePath, layoutDirectory, createLayout) {
  // Filter out special components that shouldn't be made into
  // layouts.
  if (!validatePath(systemPath.posix.relative(layoutDirectory, filePath))) {
    return;
  }

  // Create layout object
  var layout = {
    component: filePath

    // Add layout
  };createLayout(layout);
};
//# sourceMappingURL=gatsby-node.js.map