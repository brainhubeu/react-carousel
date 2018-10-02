/**
 * Module dependencies.
 */
var postcss = require("postcss")
var helpers = require("postcss-message-helpers")
var color = require("color")
var reduceFunctionCall = require("reduce-function-call")

/**
 * PostCSS plugin to transform hwb() to rgb()
 */
module.exports = postcss.plugin("postcss-color-hwb", function() {
  return function(style) {
    style.walkDecls(function transformDecl(decl) {
      if (!decl.value || decl.value.indexOf("hwb(") === -1) {
        return
      }

      decl.value = helpers.try(function transformHwb() {
        return reduceFunctionCall(decl.value, "hwb", function reduceHwb(body, fn) {
          return color(fn + "(" + body + ")").rgbString()
        })
      }, decl.source)
    })
  }
})
