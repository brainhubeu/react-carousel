"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var select = require(`unist-util-select`);
var path = require(`path`);
var isRelativeUrl = require(`is-relative-url`);
var _ = require(`lodash`);

var _require = require(`gatsby-plugin-sharp`),
    sizes = _require.sizes;

var Promise = require(`bluebird`);
var cheerio = require(`cheerio`);
var slash = require(`slash`);

// If the image is relative (not hosted elsewhere)
// 1. Find the image file
// 2. Find the image's size
// 3. Filter out any responsive image sizes that are greater than the image's width
// 4. Create the responsive images.
// 5. Set the html w/ aspect ratio helper.
module.exports = function (_ref, pluginOptions) {
  var files = _ref.files,
      markdownNode = _ref.markdownNode,
      markdownAST = _ref.markdownAST,
      pathPrefix = _ref.pathPrefix,
      getNode = _ref.getNode,
      reporter = _ref.reporter;

  var defaults = {
    maxWidth: 650,
    wrapperStyle: ``,
    backgroundColor: `white`,
    linkImagesToOriginal: true,
    showCaptions: false,
    pathPrefix
  };

  var options = _.defaults(pluginOptions, defaults);

  // This will only work for markdown syntax image tags
  var markdownImageNodes = select(markdownAST, `image`);

  // This will also allow the use of html image tags
  var rawHtmlNodes = select(markdownAST, `html`);

  // Takes a node and generates the needed images and then returns
  // the needed HTML replacement for the image
  var generateImagesAndUpdateNode = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(node, resolve) {
      var parentNode, imagePath, imageNode, responsiveSizesResult, ratio, originalImg, fallbackSrc, srcSet, presentationWidth, srcSplit, fileName, fileNameNoExt, defaultAlt, rawHTML;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Check if this markdownNode has a File parent. This plugin
              // won't work if the image isn't hosted locally.
              parentNode = getNode(markdownNode.parent);
              imagePath = void 0;

              if (!(parentNode && parentNode.dir)) {
                _context.next = 6;
                break;
              }

              imagePath = slash(path.join(parentNode.dir, node.url));
              _context.next = 7;
              break;

            case 6:
              return _context.abrupt("return", null);

            case 7:
              imageNode = _.find(files, function (file) {
                if (file && file.absolutePath) {
                  return file.absolutePath === imagePath;
                }
                return null;
              });

              if (!(!imageNode || !imageNode.absolutePath)) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", resolve());

            case 10:
              _context.next = 12;
              return sizes({
                file: imageNode,
                args: options,
                reporter
              });

            case 12:
              responsiveSizesResult = _context.sent;

              if (responsiveSizesResult) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return", resolve());

            case 15:

              // Calculate the paddingBottom %
              ratio = `${1 / responsiveSizesResult.aspectRatio * 100}%`;
              originalImg = responsiveSizesResult.originalImg;
              fallbackSrc = responsiveSizesResult.src;
              srcSet = responsiveSizesResult.srcSet;
              presentationWidth = responsiveSizesResult.presentationWidth;

              // Generate default alt tag

              srcSplit = node.url.split(`/`);
              fileName = srcSplit[srcSplit.length - 1];
              fileNameNoExt = fileName.replace(/\.[^/.]+$/, ``);
              defaultAlt = fileNameNoExt.replace(/[^A-Z0-9]/gi, ` `);

              // TODO
              // Fade in images on load.
              // https://www.perpetual-beta.org/weblog/silky-smooth-image-loading.html

              // Construct new image node w/ aspect ratio placeholder

              rawHTML = `
  <span
    class="gatsby-resp-image-wrapper"
    style="position: relative; display: block; ${options.wrapperStyle}; max-width: ${presentationWidth}px; margin-left: auto; margin-right: auto;"
  >
    <span
      class="gatsby-resp-image-background-image"
      style="padding-bottom: ${ratio}; position: relative; bottom: 0; left: 0; background-image: url('${responsiveSizesResult.base64}'); background-size: cover; display: block;"
    >
      <img
        class="gatsby-resp-image-image"
        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px ${options.backgroundColor};"
        alt="${node.alt ? node.alt : defaultAlt}"
        title="${node.title ? node.title : ``}"
        src="${fallbackSrc}"
        srcset="${srcSet}"
        sizes="${responsiveSizesResult.sizes}"
      />
    </span>
  </span>
  `;

              // Make linking to original image optional.

              if (options.linkImagesToOriginal) {
                rawHTML = `
  <a
    class="gatsby-resp-image-link"
    href="${originalImg}"
    style="display: block"
    target="_blank"
    rel="noopener"
  >
  ${rawHTML}
  </a>
    `;
              }

              // Wrap in figure and use title as caption

              if (options.showCaptions && node.title) {
                rawHTML = `
  <figure class="gatsby-resp-image-figure">
  ${rawHTML}
  <figcaption class="gatsby-resp-image-figcaption">${node.title}</figcaption>
  </figure>
      `;
              }

              return _context.abrupt("return", rawHTML);

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function generateImagesAndUpdateNode(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  return Promise.all(
  // Simple because there is no nesting in markdown
  markdownImageNodes.map(function (node) {
    return new Promise(function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(resolve, reject) {
        var fileType, rawHTML;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fileType = node.url.slice(-3);

                // Ignore gifs as we can't process them,
                // svgs as they are already responsive by definition

                if (!(isRelativeUrl(node.url) && fileType !== `gif` && fileType !== `svg`)) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 4;
                return generateImagesAndUpdateNode(node, resolve);

              case 4:
                rawHTML = _context2.sent;


                if (rawHTML) {
                  // Replace the image node with an inline HTML node.
                  node.type = `html`;
                  node.value = rawHTML;
                }
                return _context2.abrupt("return", resolve(node));

              case 9:
                return _context2.abrupt("return", resolve());

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x3, _x4) {
        return _ref3.apply(this, arguments);
      };
    }());
  })).then(function (markdownImageNodes) {
    return (
      // HTML image node stuff
      Promise.all(
      // Complex because HTML nodes can contain multiple images
      rawHtmlNodes.map(function (node) {
        return new Promise(function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
            var $, imageRefs, _iterator, _isArray, _i, _ref5, thisImg, formattedImgTag, fileType, rawHTML;

            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (node.value) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt("return", resolve());

                  case 2:
                    $ = cheerio.load(node.value);

                    if (!($(`img`).length === 0)) {
                      _context3.next = 5;
                      break;
                    }

                    return _context3.abrupt("return", resolve());

                  case 5:
                    imageRefs = [];

                    $(`img`).each(function () {
                      imageRefs.push($(this));
                    });

                    _iterator = imageRefs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                  case 8:
                    if (!_isArray) {
                      _context3.next = 14;
                      break;
                    }

                    if (!(_i >= _iterator.length)) {
                      _context3.next = 11;
                      break;
                    }

                    return _context3.abrupt("break", 37);

                  case 11:
                    _ref5 = _iterator[_i++];
                    _context3.next = 18;
                    break;

                  case 14:
                    _i = _iterator.next();

                    if (!_i.done) {
                      _context3.next = 17;
                      break;
                    }

                    return _context3.abrupt("break", 37);

                  case 17:
                    _ref5 = _i.value;

                  case 18:
                    thisImg = _ref5;

                    // Get the details we need.
                    formattedImgTag = {};

                    formattedImgTag.url = thisImg.attr(`src`);
                    formattedImgTag.title = thisImg.attr(`title`);
                    formattedImgTag.alt = thisImg.attr(`alt`);

                    if (formattedImgTag.url) {
                      _context3.next = 25;
                      break;
                    }

                    return _context3.abrupt("return", resolve());

                  case 25:
                    fileType = formattedImgTag.url.slice(-3);

                    // Ignore gifs as we can't process them,
                    // svgs as they are already responsive by definition

                    if (!(isRelativeUrl(formattedImgTag.url) && fileType !== `gif` && fileType !== `svg`)) {
                      _context3.next = 35;
                      break;
                    }

                    _context3.next = 29;
                    return generateImagesAndUpdateNode(formattedImgTag, resolve);

                  case 29:
                    rawHTML = _context3.sent;

                    if (!rawHTML) {
                      _context3.next = 34;
                      break;
                    }

                    // Replace the image string
                    thisImg.replaceWith(rawHTML);
                    _context3.next = 35;
                    break;

                  case 34:
                    return _context3.abrupt("return", resolve());

                  case 35:
                    _context3.next = 8;
                    break;

                  case 37:

                    // Replace the image node with an inline HTML node.
                    node.type = `html`;
                    node.value = $(`body`).html(); // fix for cheerio v1

                    return _context3.abrupt("return", resolve(node));

                  case 40:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, undefined);
          }));

          return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
          };
        }());
      })).then(function (htmlImageNodes) {
        return markdownImageNodes.concat(htmlImageNodes).filter(function (node) {
          return !!node;
        });
      })
    );
  });
};