"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);
var normalize = require(`normalize-path`);

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case `DELETE_CACHE`:
      return {};
    case `CREATE_PAGE`:
    case `CREATE_LAYOUT`:
      action.payload.componentPath = normalize(action.payload.component);
      state[action.payload.componentPath] = _.merge({ query: `` }, state[action.payload.componentPath], {
        componentPath: action.payload.componentPath
      });
      return state;
    case `DELETE_PAGE`:
      action.payload.componentPath = normalize(action.payload.component);
      delete state[action.payload.componentPath];
      return state;
    case `REPLACE_COMPONENT_QUERY`:
      action.payload.componentPath = normalize(action.payload.componentPath);
      state[action.payload.componentPath] = (0, _extends3.default)({}, state[action.payload.componentPath], {
        query: action.payload.query
      });
      return state;
  }

  return state;
};
//# sourceMappingURL=components.js.map