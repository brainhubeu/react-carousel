"use strict";

var _ = require(`lodash`);
var normalize = require(`normalize-path`);

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case `DELETE_CACHE`:
      return [];
    case `CREATE_LAYOUT`:
      {
        action.payload.component = normalize(action.payload.component);
        action.payload.componentWrapperPath = normalize(action.payload.componentWrapperPath);
        if (!action.plugin && !action.plugin.name) {
          console.log(``);
          console.error(JSON.stringify(action, null, 4));
          console.log(``);
          throw new Error(`Pages can only be created by plugins. There wasn't a plugin set
        when creating this page.`);
        }
        action.payload.pluginCreator___NODE = `Plugin ${action.plugin.name}`;
        var index = _.findIndex(state, function (l) {
          return l.id === action.payload.id;
        });
        // If the id already exists, overwrite it.
        // Otherwise, add it to the end.
        if (index !== -1) {
          return [].concat(state.slice(0, index).concat(action.payload).concat(state.slice(index + 1)));
        } else {
          return [].concat(state.concat(action.payload));
        }
      }
    case `DELETE_LAYOUT`:
      return state.filter(function (l) {
        return l.id !== action.payload.id;
      });
    default:
      return state;
  }
};
//# sourceMappingURL=layouts.js.map