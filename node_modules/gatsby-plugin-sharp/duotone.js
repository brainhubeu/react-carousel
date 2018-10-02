"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var overlayDuotone = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(duotoneImage, originalImage, duotone, format) {
    var info, percentGrey, percentTransparency, duotoneWithTransparency;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return duotoneImage.flatten().metadata().then(function (info) {
              return info;
            });

          case 2:
            info = _context2.sent;

            // see https://github.com/lovell/sharp/issues/859#issuecomment-311319149
            percentGrey = Math.round(duotone.opacity / 100 * 255);
            percentTransparency = Buffer.alloc(info.width * info.height, percentGrey);
            _context2.next = 7;
            return duotoneImage.joinChannel(percentTransparency, {
              raw: { width: info.width, height: info.height, channels: 1 }
            }).raw().toBuffer();

          case 7:
            duotoneWithTransparency = _context2.sent;
            _context2.next = 10;
            return originalImage.overlayWith(duotoneWithTransparency, {
              raw: { width: info.width, height: info.height, channels: 4 }
            }).toBuffer({ resolveWithObject: true }).then(function (_ref4) {
              var data = _ref4.data,
                  info = _ref4.info;
              return sharp(data, {
                raw: info
              }).toFormat(format);
            });

          case 10:
            return _context2.abrupt("return", _context2.sent);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function overlayDuotone(_x4, _x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sharp = require(`sharp`);

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(duotone, format, clonedPipeline) {
    var duotoneGradient, duotoneImage;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            duotoneGradient = createDuotoneGradient(hexToRgb(duotone.highlight), hexToRgb(duotone.shadow));

            // @todo remove once we upgrade to sharp v0.18 which
            // adds an alias for "jpg" to toFormat
            // @see http://sharp.dimens.io/en/stable/changelog/#v0180-30th-may-2017

            if (format === `jpg`) {
              format = `jpeg`;
            }

            _context.next = 4;
            return clonedPipeline.raw().toBuffer({ resolveWithObject: true }).then(function (_ref2) {
              var data = _ref2.data,
                  info = _ref2.info;

              for (var i = 0; i < data.length; i = i + info.channels) {
                var r = data[i + 0];
                var g = data[i + 1];
                var b = data[i + 2];

                // @see https://en.wikipedia.org/wiki/Relative_luminance
                var avg = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

                data[i + 0] = duotoneGradient[avg][0];
                data[i + 1] = duotoneGradient[avg][1];
                data[i + 2] = duotoneGradient[avg][2];
              }

              return sharp(data, {
                raw: info
              }).toFormat(format);
            });

          case 4:
            duotoneImage = _context.sent;

            if (!duotone.opacity) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", overlayDuotone(duotoneImage, clonedPipeline, duotone, format));

          case 9:
            return _context.abrupt("return", duotoneImage);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function duotone(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return duotone;
}();

// @see https://github.com/nagelflorian/react-duotone/blob/master/src/hex-to-rgb.js
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

// @see https://github.com/nagelflorian/react-duotone/blob/master/src/create-duotone-gradient.js
function createDuotoneGradient(primaryColorRGB, secondaryColorRGB) {
  var duotoneGradient = [];

  for (var i = 0; i < 256; i++) {
    var ratio = i / 255;
    duotoneGradient.push([Math.round(primaryColorRGB[0] * ratio + secondaryColorRGB[0] * (1 - ratio)), Math.round(primaryColorRGB[1] * ratio + secondaryColorRGB[1] * (1 - ratio)), Math.round(primaryColorRGB[2] * ratio + secondaryColorRGB[2] * (1 - ratio))]);
  }

  return duotoneGradient;
}