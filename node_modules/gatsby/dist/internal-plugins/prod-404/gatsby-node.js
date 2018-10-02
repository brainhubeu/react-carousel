"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var created404 = false;
exports.onCreatePage = function (_ref) {
  var page = _ref.page,
      store = _ref.store,
      boundActionCreators = _ref.boundActionCreators;

  // Copy /404/ to /404.html as many static site hosts expect
  // site 404 pages to be named this.
  // https://www.gatsbyjs.org/docs/add-404-page/
  if (!created404 && page.path === `/404/`) {
    boundActionCreators.createPage((0, _extends3.default)({}, page, {
      path: `/404.html`
    }));
    created404 = true;
  }
};
//# sourceMappingURL=gatsby-node.js.map