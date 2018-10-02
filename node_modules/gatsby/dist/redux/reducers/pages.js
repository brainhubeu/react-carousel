"use strict";

var normalize = require(`normalize-path`);

var stateToMap = function stateToMap(state) {
  var stateMap = new Map();
  state.forEach(function (payload) {
    return stateMap.set(payload.path, payload);
  });
  return stateMap;
};

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case `DELETE_CACHE`:
      return [];
    case `CREATE_PAGE`:
      {
        action.payload.component = normalize(action.payload.component);
        if (!action.plugin && !action.plugin.name) {
          console.log(``);
          console.error(JSON.stringify(action, null, 4));
          console.log(``);
          throw new Error(`Pages can only be created by plugins. There wasn't a plugin set
        when creating this page.`);
        }
        // Link page to its plugin.
        action.payload.pluginCreator___NODE = action.plugin.id;
        action.payload.pluginCreatorId = action.plugin.id;

        var stateMap = stateToMap(state);
        stateMap.set(action.payload.path, action.payload);
        return Array.from(stateMap.values());
      }
    case `DELETE_PAGE`:
      {
        var _stateMap = stateToMap(state);
        _stateMap.delete(action.payload.path);
        return Array.from(_stateMap.values());
      }
    default:
      return state;
  }
};
//# sourceMappingURL=pages.js.map