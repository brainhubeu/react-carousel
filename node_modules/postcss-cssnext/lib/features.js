"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable max-len */
exports.default = {
  /**
   * REMINDER:
   * ******************
   * order is important
   * ******************
   */
  // https://npmjs.com/package/postcss-custom-properties
  customProperties: function customProperties(options) {
    return require("postcss-custom-properties")(options);
  },

  // https://npmjs.com/package/postcss-apply
  applyRule: function applyRule(options) {
    return require("postcss-apply")(options);
  },

  // https://npmjs.com/package/postcss-calc
  calc: function calc(options) {
    return require("postcss-calc")(options);
  },

  // https://www.npmjs.com/package/postcss-image-set-polyfill
  imageSet: function imageSet(options) {
    return require("postcss-image-set-polyfill")(options);
  },

  // https://npmjs.com/package/postcss-nesting
  nesting: function nesting(options) {
    return require("postcss-nesting")(options);
  },

  // https://npmjs.com/package/postcss-custom-media
  customMedia: function customMedia(options) {
    return require("postcss-custom-media")(options);
  },

  // https://npmjs.com/package/postcss-media-minmax
  mediaQueriesRange: function mediaQueriesRange(options) {
    return require("postcss-media-minmax")(options);
  },

  // https://npmjs.com/package/postcss-custom-selectors
  customSelectors: function customSelectors(options) {
    return require("postcss-custom-selectors")(options);
  },

  // https://npmjs.com/package/postcss-attribute-case-insensitive
  attributeCaseInsensitive: function attributeCaseInsensitive(options) {
    return require("postcss-attribute-case-insensitive")(options);
  },

  // https://npmjs.com/package/postcss-color-rebeccapurple
  colorRebeccapurple: function colorRebeccapurple(options) {
    return require("postcss-color-rebeccapurple")(options);
  },

  // https://npmjs.com/package/postcss-color-hwb
  colorHwb: function colorHwb(options) {
    return require("postcss-color-hwb")(options);
  },

  // https://npmjs.com/package/postcss-color-hsl
  colorHsl: function colorHsl(options) {
    return require("postcss-color-hsl")(options);
  },

  // https://npmjs.com/package/postcss-color-rgb
  colorRgb: function colorRgb(options) {
    return require("postcss-color-rgb")(options);
  },

  // https://npmjs.com/package/postcss-color-gray
  colorGray: function colorGray(options) {
    return require("postcss-color-gray")(options);
  },

  // https://npmjs.com/package/postcss-color-hex-alpha
  colorHexAlpha: function colorHexAlpha(options) {
    return require("postcss-color-hex-alpha")(options);
  },

  // https://npmjs.com/package/postcss-color-function
  colorFunction: function colorFunction(options) {
    return require("postcss-color-function")(options);
  },

  // https://npmjs.com/package/postcss-font-family-system-ui
  fontFamilySystemUi: function fontFamilySystemUi(options) {
    return require("postcss-font-family-system-ui")(options);
  },

  // https://npmjs.com/package/postcss-font-variant
  fontVariant: function fontVariant(options) {
    return require("postcss-font-variant")(options);
  },

  // https://npmjs.com/package/pleeease-filters
  filter: function filter(options) {
    return require("pleeease-filters")(options);
  },

  // https://npmjs.com/package/postcss-initial
  initial: function initial(options) {
    return require("postcss-initial")(options);
  },

  // https://npmjs.com/package/pixrem
  rem: function rem(options) {
    return require("pixrem")(options);
  },

  // https://npmjs.com/package/postcss-pseudoelements
  pseudoElements: function pseudoElements(options) {
    return require("postcss-pseudoelements")(options);
  },

  // https://npmjs.com/package/postcss-selector-matches
  pseudoClassMatches: function pseudoClassMatches(options) {
    return require("postcss-selector-matches")(options);
  },

  // https://npmjs.com/package/postcss-selector-not
  pseudoClassNot: function pseudoClassNot(options) {
    return require("postcss-selector-not")(options);
  },

  // https://npmjs.com/package/postcss-pseudo-class-any-link
  pseudoClassAnyLink: function pseudoClassAnyLink(options) {
    return require("postcss-pseudo-class-any-link")(options);
  },

  // https://npmjs.com/package/postcss-color-rgba-fallback
  colorRgba: function colorRgba(options) {
    return require("postcss-color-rgba-fallback")(options);
  },

  // https://www.npmjs.com/package/postcss-replace-overflow-wrap
  overflowWrap: function overflowWrap(options) {
    return require("postcss-replace-overflow-wrap")(options);
  },

  // https://npmjs.com/package/autoprefixer
  autoprefixer: function autoprefixer(options) {
    return require("autoprefixer")(options);
  }
};