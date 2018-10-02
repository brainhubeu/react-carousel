'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onRenderBody = function (_ref) {
  var setHeadComponents = _ref.setHeadComponents;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : pluginOptions,
      _ref2$injectHTML = _ref2.injectHTML,
      injectHTML = _ref2$injectHTML === undefined ? true : _ref2$injectHTML,
      _ref2$icons = _ref2.icons,
      _ref2$icons$android = _ref2$icons.android,
      android = _ref2$icons$android === undefined ? true : _ref2$icons$android,
      _ref2$icons$appleIcon = _ref2$icons.appleIcon,
      appleIcon = _ref2$icons$appleIcon === undefined ? true : _ref2$icons$appleIcon,
      _ref2$icons$appleStar = _ref2$icons.appleStartup,
      appleStartup = _ref2$icons$appleStar === undefined ? true : _ref2$icons$appleStar,
      _ref2$icons$coast = _ref2$icons.coast,
      coast = _ref2$icons$coast === undefined ? true : _ref2$icons$coast,
      _ref2$icons$favicons = _ref2$icons.favicons,
      favicons = _ref2$icons$favicons === undefined ? true : _ref2$icons$favicons,
      _ref2$icons$firefox = _ref2$icons.firefox,
      firefox = _ref2$icons$firefox === undefined ? true : _ref2$icons$firefox,
      _ref2$icons$twitter = _ref2$icons.twitter,
      twitter = _ref2$icons$twitter === undefined ? true : _ref2$icons$twitter,
      _ref2$icons$yandex = _ref2$icons.yandex,
      yandex = _ref2$icons$yandex === undefined ? true : _ref2$icons$yandex,
      _ref2$icons$windows = _ref2$icons.windows,
      windows = _ref2$icons$windows === undefined ? true : _ref2$icons$windows;

  if (injectHTML) {
    var prefix = typeof __PATH_PREFIX__ !== 'undefined' ? __PATH_PREFIX__ : '';
    var HeadComponents = [];

    if (android) {
      HeadComponents.push(_react2.default.createElement('link', {
        rel: 'manifest',
        href: prefix + '/favicons/manifest.json',
        key: 'android-manifest'
      }));
    }
    if (appleIcon) {
      HeadComponents.push(_react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: prefix + '/favicons/apple-touch-icon-57x57.png',
        key: 'apple-touch-icon-57x57'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: prefix + '/favicons/apple-touch-icon-60x60.png',
        key: 'apple-touch-icon-60x60'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: prefix + '/favicons/apple-touch-icon-72x72.png',
        key: 'apple-touch-icon-72x72'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: prefix + '/favicons/apple-touch-icon-76x76.png',
        key: 'apple-touch-icon-76x76'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: prefix + '/favicons/apple-touch-icon-114x114.png',
        key: 'apple-touch-icon-114x114'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: prefix + '/favicons/apple-touch-icon-120x120.png',
        key: 'apple-touch-icon-120x120'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: prefix + '/favicons/apple-touch-icon-144x144.png',
        key: 'apple-touch-icon-144x144'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: prefix + '/favicons/apple-touch-icon-152x152.png',
        key: 'apple-touch-icon-152x152'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: prefix + '/favicons/apple-touch-icon-180x180.png',
        key: 'apple-touch-icon-180x180'
      }));
    }
    if (appleStartup) {
      HeadComponents.push(_react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)',
        href: prefix + '/favicons/apple-touch-startup-image-320x460.png',
        key: 'apple-touch-startup-image-320x460'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)',
        href: prefix + '/favicons/apple-touch-startup-image-640x920.png',
        key: 'apple-touch-startup-image-640x920'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
        href: prefix + '/favicons/apple-touch-startup-image-640x1096.png',
        key: 'apple-touch-startup-image-640x1096'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
        href: prefix + '/favicons/apple-touch-startup-image-750x1294.png',
        key: 'apple-touch-startup-image-750x1294'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)',
        href: prefix + '/favicons/apple-touch-startup-image-1182x2208.png',
        key: 'apple-touch-startup-image-1182x2208'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)',
        href: prefix + '/favicons/apple-touch-startup-image-1242x2148.png',
        key: 'apple-touch-startup-image-1242x2148'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)',
        href: prefix + '/favicons/apple-touch-startup-image-748x1024.png',
        key: 'apple-touch-startup-image-748x1024'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)',
        href: prefix + '/favicons/apple-touch-startup-image-768x1004.png',
        key: 'apple-touch-startup-image-768x1004'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)',
        href: prefix + '/favicons/apple-touch-startup-image-1496x2048.png',
        key: 'apple-touch-startup-image-1496x2048'
      }), _react2.default.createElement('link', {
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
        href: prefix + '/favicons/apple-touch-startup-image-1536x2008.png',
        key: 'apple-touch-startup-image-1536x2008'
      }));
    }
    if (favicons) {
      HeadComponents.push(_react2.default.createElement('link', {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: prefix + '/favicons/favicon-32x32.png',
        key: 'favicon-32x32'
      }), _react2.default.createElement('link', {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: prefix + '/favicons/favicon-16x16.png',
        key: 'favicon-16x16'
      }), _react2.default.createElement('link', {
        rel: 'shortcut icon',
        href: prefix + '/favicons/favicon.ico',
        key: 'favicon'
      }));
    }
    if (coast) {
      HeadComponents.push(_react2.default.createElement('link', {
        rel: 'icon',
        type: 'image/png',
        sizes: '228x228',
        href: prefix + '/favicons/coast-228x228.png',
        key: 'coast-228x228'
      }));
    }
    if (windows) {
      HeadComponents.push(_react2.default.createElement('meta', {
        name: 'msapplication-TileImage',
        content: prefix + '/favicons/mstile-144x144.png',
        key: 'mstile-144x144'
      }), _react2.default.createElement('meta', {
        name: 'msapplication-config',
        content: prefix + '/favicons/browserconfig.xml',
        key: 'browserconfig-xml'
      }));
    }
    if (yandex) {
      HeadComponents.push(_react2.default.createElement('link', {
        rel: 'yandex-tableau-widget',
        href: prefix + '/favicons/yandex-browser-manifest.json',
        key: 'yandex-manifest'
      }));
    }

    setHeadComponents(HeadComponents);
  }
};