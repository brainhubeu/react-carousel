"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _redux = require("../../redux/");

var _path = require("../../utils/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeRedirects = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _store$getState, program, redirects, browserRedirects;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bootstrapFinished = true;

            _store$getState = _redux.store.getState(), program = _store$getState.program, redirects = _store$getState.redirects;

            // Filter for redirects that are meant for the browser.

            browserRedirects = redirects.filter(function (r) {
              return r.redirectInBrowser;
            });
            _context.next = 5;
            return _fsExtra2.default.writeFile((0, _path.joinPath)(program.directory, `.cache/redirects.json`), JSON.stringify(browserRedirects, null, 2));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function writeRedirects() {
    return _ref.apply(this, arguments);
  };
}();

exports.writeRedirects = writeRedirects;

var bootstrapFinished = false;
var oldRedirects = void 0;
var debouncedWriteRedirects = _lodash2.default.debounce(function () {
  // Don't write redirects again until bootstrap has finished.
  if (bootstrapFinished && !_lodash2.default.isEqual(oldRedirects, _redux.store.getState().redirects)) {
    writeRedirects();
    oldRedirects = _redux.store.getState().Redirects;
  }
}, 250);

_redux.emitter.on(`CREATE_REDIRECT`, function () {
  debouncedWriteRedirects();
});
//# sourceMappingURL=redirects-writer.js.map