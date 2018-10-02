'use strict';

var writeRedirectsFile = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(redirects, folder, pathPrefix) {
    var _iterator, _isArray, _i, _ref2, redirect, fromPath, toPath, FILE_PATH, fileExists, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (redirects.length) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return');

          case 2:
            _iterator = redirects, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

          case 3:
            if (!_isArray) {
              _context.next = 9;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('break', 32);

          case 6:
            _ref2 = _iterator[_i++];
            _context.next = 13;
            break;

          case 9:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('break', 32);

          case 12:
            _ref2 = _i.value;

          case 13:
            redirect = _ref2;
            fromPath = redirect.fromPath, toPath = redirect.toPath;
            FILE_PATH = path.join(folder, fromPath.replace(pathPrefix, ''), 'index.html');
            _context.next = 18;
            return exists(FILE_PATH);

          case 18:
            fileExists = _context.sent;

            if (fileExists) {
              _context.next = 30;
              break;
            }

            _context.prev = 20;
            _context.next = 23;
            return ensureDir(path.dirname(FILE_PATH));

          case 23:
            _context.next = 27;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context['catch'](20);

          case 27:
            data = getMetaRedirect(toPath);
            _context.next = 30;
            return writeFile(FILE_PATH, data);

          case 30:
            _context.next = 3;
            break;

          case 32:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[20, 25]]);
  }));

  return function writeRedirectsFile(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');

var _require = require('fs-extra'),
    exists = _require.exists,
    writeFile = _require.writeFile,
    ensureDir = _require.ensureDir;

var getMetaRedirect = require('./getMetaRedirect');

exports.onPostBuild = function (_ref3) {
  var store = _ref3.store;

  var _store$getState = store.getState(),
      redirects = _store$getState.redirects,
      program = _store$getState.program,
      config = _store$getState.config;

  var pathPrefix = '';
  if (program.prefixPaths) {
    pathPrefix = config.pathPrefix;
  }

  var folder = path.join(program.directory, 'public');
  return writeRedirectsFile(redirects, folder, pathPrefix);
};