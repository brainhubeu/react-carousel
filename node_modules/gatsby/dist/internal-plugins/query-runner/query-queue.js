"use strict";

var Queue = require(`better-queue`);

var queryRunner = require(`./query-runner`);

var _require = require(`../../redux`),
    store = _require.store;

var queue = new Queue(function (plObj, callback) {
  var state = store.getState();
  return queryRunner(plObj, state.components[plObj.component]).then(function (result) {
    return callback(null, result);
  }, function (error) {
    return callback(error);
  });
}, { concurrent: 4 });

module.exports = queue;
//# sourceMappingURL=query-queue.js.map