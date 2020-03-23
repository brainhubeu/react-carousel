import { JSDOM } from 'jsdom';

const { document } = (new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;

// Simulate window resize event
const resizeEvent = document.createEvent('Event');
resizeEvent.initEvent('resize', true, true);

window.resizeTo = (width, height) => {
  window.innerWidth = width || global.window.innerWidth;
  window.innerHeight = height || global.window.innerHeight;
  window.dispatchEvent(resizeEvent);
};

describe('Test setup', () => {
  it('adds values', () => {
    expect(1 + 1).toEqual(2);
  });
});
