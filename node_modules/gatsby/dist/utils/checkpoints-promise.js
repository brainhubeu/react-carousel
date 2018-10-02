"use strict";

// Wait for things to happen before continuing.
var Promise = require(`bluebird`);
var _ = require(`lodash`);

var _require = require(`../redux`),
    emitter = _require.emitter;

var waiters = [];
emitter.on(`BOOTSTRAP_STAGE`, function (action) {
  var stage = action.payload.stage;
  // Remove this stage from the waiters
  waiters = waiters.map(function (w) {
    var newWaiter = {
      resolve: w.resolve,
      events: _.difference(w.events, [stage])
    };

    if (newWaiter.events.length === 0) {
      // Call resolve function then remove by returning undefined.
      newWaiter.resolve();
      return undefined;
    } else {
      return newWaiter;
    }
  });

  // Cleanup null entries
  waiters = _.filter(waiters);
});

module.exports = function (_ref) {
  var events = _ref.events;
  return new Promise(function (resolve) {
    waiters.push({
      resolve,
      events
    });
  });
};
//# sourceMappingURL=checkpoints-promise.js.map