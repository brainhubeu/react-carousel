"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case `DELETE_CACHE`:
      return {};
    case `CREATE_NODE`:
      {
        newState = (0, _extends3.default)({}, state, {
          [action.payload.id]: action.payload
        });
        return newState;
      }

    case `ADD_FIELD_TO_NODE`:
    case `ADD_CHILD_NODE_TO_PARENT_NODE`:
      newState = (0, _extends3.default)({}, state, {
        [action.payload.id]: action.payload
      });
      return newState;

    case `DELETE_NODE`:
      {
        newState = _.omit(state, action.payload);
        return newState;
      }

    case `DELETE_NODES`:
      {
        newState = _.omit(state, action.payload);
        return newState;
      }

    default:
      return state;
  }
};
//# sourceMappingURL=nodes.js.map