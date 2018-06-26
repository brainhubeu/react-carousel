"use strict";

exports.__esModule = true;
exports.default = void 0;
var _default = {
  resizeEventListenerThrottle: 300,
  // event listener onResize will not be triggered more frequently than once per given number of miliseconds
  clickDragThreshold: 10,
  numberOfInfiniteClones: 3 // number of clones (for each side) of slides that should be created for infinite carousel

};
exports.default = _default;