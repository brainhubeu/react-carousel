"use strict";

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case `CREATE_REDIRECT`:
      return [].concat(state, [action.payload]);
    default:
      return state;
  }
};
//# sourceMappingURL=redirects.js.map