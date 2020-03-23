/**
 * Clamps number between 0 and last slide index.
 * @param {number} value to be clamped
 * @param {[node]} slides of react-carousel component
 * @param {boolean} rtl decide whether to clamp value for rtl carousel
 * @return {number} new value
 */
const clamp = (value, slides) => {
  const getChildren = () => {
    if (slides) {
      return slides;
    }
    return [];
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
