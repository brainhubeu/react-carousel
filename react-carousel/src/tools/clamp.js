/**
 * Clamps number between 0 and last slide index.
 * @param {number} value to be clamped
 * @param {[node]} children of react-carousel component
 * @param {[node]} slides defined as react-carousel property
 * @return {number} new value
 */
const clamp = (value, children, slides) => {
  const getChildren = () => {
    if (!children) {
      if (slides) {
        return slides;
      }
      return [];
    }
    if (Array.isArray(children)) {
      return children;
    }
    return [children];
  };

  const maxValue = getChildren().length - 1;
  if (value > maxValue) {
    return maxValue;
  }
  if (value < 0) {
    return 0;
  }
  return value;
};

export default clamp;
