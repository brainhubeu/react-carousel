import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { JSDOM } from 'jsdom';

const { document } = (new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;

chai.use(chaiEnzyme());
chai.should();

describe('Carousel', () => {
  it('should work');
});
