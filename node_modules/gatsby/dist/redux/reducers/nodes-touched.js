"use strict";

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case `CREATE_NODE`:
      state[action.payload.id] = true;
      return state;

    case `TOUCH_NODE`:
      state[action.payload] = true;
      return state;

    default:
      return state;
  }
};
//# sourceMappingURL=nodes-touched.js.map