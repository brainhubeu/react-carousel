/**
 * Simulates mouse events when touch events occur
 * @param {event} event A touch event
 */
const simulateEvent = (event) => {
  const touch = event.changedTouches[0];
  const { screenX, screenY, clientX, clientY } = touch;
  const touchEventMap = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
  };
  const simulatedEvent = new MouseEvent(touchEventMap[event.type], {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 1,
    screenX,
    screenY,
    clientX,
    clientY,
  });
  touch.target.dispatchEvent(simulatedEvent);
};

export default simulateEvent;
