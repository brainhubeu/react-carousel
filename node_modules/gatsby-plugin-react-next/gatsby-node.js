"use strict";

var path = require("path");
var React = require(path.resolve(process.cwd(), "node_modules/react"));

exports.modifyWebpackConfig = function (_ref) {
  var config = _ref.config,
      stage = _ref.stage;

  if (React.version.slice(0, 2) !== "16") {
    config._config.resolve.alias = {
      react: "gatsby-plugin-react-next/node_modules/react",
      "react-dom": "gatsby-plugin-react-next/node_modules/react-dom"
    };
  }

  return config;
};