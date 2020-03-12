/* eslint-disable import/first */
if (!String.prototype.endsWith) {
  // eslint-disable-next-line no-extend-native
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

export default {
  resizeEventListenerThrottle: 300, // event listener onResize will not be triggered more frequently than once per given number of miliseconds
  clickDragThreshold: 10,
  numberOfInfiniteClones: 3, // number of clones (for each side) of slides that should be created for infinite carousel
};
