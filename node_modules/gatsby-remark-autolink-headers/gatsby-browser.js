"use strict";

var scrollToHash = function scrollToHash(offsetY) {
  // Make sure React has had a chance to flush to DOM first.
  setTimeout(function () {
    var hash = window.decodeURI(window.location.hash.replace("#", ""));
    if (hash !== "") {
      var element = document.getElementById(hash);
      if (element) {
        var offset = element.offsetTop;
        window.scrollTo(0, offset - offsetY);
      }
    }
  }, 10);
};

exports.onClientEntry = function (args, pluginOptions) {
  var offsetY = 0;
  if (pluginOptions.offsetY) {
    offsetY = pluginOptions.offsetY;
  }
  // This code is only so scrolling to header hashes works in development.
  // For production, the equivalent code is in gatsby-ssr.js.
  if (process.env.NODE_ENV !== "production") {
    scrollToHash(offsetY);
  }
};

exports.onRouteUpdate = function (args, pluginOptions) {
  var offsetY = 0;
  if (pluginOptions.offsetY) {
    offsetY = pluginOptions.offsetY;
  }

  scrollToHash(offsetY);
};