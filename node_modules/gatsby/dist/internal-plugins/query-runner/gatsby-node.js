"use strict";

var fs = require(`fs`);

var _require = require(`../../utils/path`),
    joinPath = _require.joinPath;

var _require2 = require(`./query-watcher`),
    watchComponent = _require2.watchComponent;

var components = {};

var handlePageOrLayout = function handlePageOrLayout(store) {
  return function (pageOrLayout) {
    // Ensure page/layout component has a JSON file.
    var jsonDest = joinPath(store.getState().program.directory, `.cache`, `json`, pageOrLayout.jsonName);
    if (!fs.existsSync(jsonDest)) {
      fs.writeFile(jsonDest, `{}`, function () {});
    }

    // Ensure layout component has a wrapper entry component file (which
    // requires its JSON file so the data + code are one bundle).
    if (pageOrLayout.isLayout) {
      var wrapperComponent = `
  import React from "react"
  import Component from "${pageOrLayout.component}"
  import data from "${jsonDest}"

  export default (props) => <Component {...props} {...data} />
  `;
      fs.writeFileSync(pageOrLayout.componentWrapperPath, wrapperComponent);
    }

    var component = store.getState().components[pageOrLayout.componentPath];

    if (components[component.componentPath]) {
      return;
    }

    // Watch the component to detect query changes.
    watchComponent(component.componentPath);
  };
};

exports.onCreatePage = function (_ref) {
  var page = _ref.page,
      store = _ref.store,
      boundActionCreators = _ref.boundActionCreators;

  handlePageOrLayout(store)(page);
};

exports.onCreateLayout = function (_ref2) {
  var layout = _ref2.layout,
      store = _ref2.store,
      boundActionCreators = _ref2.boundActionCreators;

  handlePageOrLayout(store)(layout);
};
//# sourceMappingURL=gatsby-node.js.map