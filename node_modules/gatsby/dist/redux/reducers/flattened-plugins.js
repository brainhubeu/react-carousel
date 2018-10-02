"use strict";

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case `SET_SITE_FLATTENED_PLUGINS`:
      return [].concat(action.payload);
    default:
      return state;
  }
};
//# sourceMappingURL=flattened-plugins.js.map