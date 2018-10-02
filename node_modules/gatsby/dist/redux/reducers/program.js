"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { directory: `/` };
  var action = arguments[1];

  switch (action.type) {
    case `SET_PROGRAM`:
      return (0, _extends3.default)({}, action.payload);

    case `SET_PROGRAM_EXTENSIONS`:
      return (0, _extends3.default)({}, state, {
        extensions: action.payload
      });

    default:
      return state;
  }
};
//# sourceMappingURL=program.js.map