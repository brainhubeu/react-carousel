/* eslint-disable babel/no-invalid-this */

describe('React Carousel', () => {
  it('swipes slide', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/controlled');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.moveToObject('img', { x: 500, y: 0 });
    await browser.buttonDown();
    await browser.moveToObject('.BrainhubCarousel__arrowLeft', { x: 500, y: 200 });
    await browser.moveToObject('img');
    await browser.buttonUp();

    await browser.pause(1000);
    await browser.assertView('Carousel swipe left', ['.BrainhubCarousel']);
  });

  it('changes slide when clicking on the arrow', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/controlled');
    await browser.pause(1000);

    await browser.click('.BrainhubCarousel__arrowRight');
    await browser.pause(1000);
    await browser.assertView('rightArrowPressed', ['.BrainhubCarousel']);
    await browser.click('.BrainhubCarousel__arrowLeft');

    await browser.pause(1000);
    await browser.assertView('leftArrowPressed', ['.BrainhubCarousel']);
  });

  it('goes to slide typed in the input', async function() {
    const ARROW_RIGHT_KEY = '\uE014';

    const browser = this.browser;
    await browser.url('/docs/examples/controlled');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);
    // Focus
    await browser.execute(function() {
      document.querySelector('input').focus();
    });
    await browser.keys(ARROW_RIGHT_KEY);
    // Focus
    await browser.execute(function() {
      document.querySelector('input').focus();
    });
    // Press keys:
    await browser.keys('2');

    await browser.pause(1000);
    await browser.assertView('MoveToThirdSlide', ['.BrainhubCarousel']);
  });

  it('changes slide on next slide click', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/clickToChange');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.click('.BrainhubCarouselItem:nth-child(2)');

    await browser.pause(1000);
    await browser.assertView('item clicked', ['.BrainhubCarousel']);
  });

  it('automatically changes slides ', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/animation');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.pause(3000);
    await browser.assertView('autoPlay 2 slides later', ['.BrainhubCarousel']);
  });

  it('changes slide on dot click', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/dots');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.click('.BrainhubCarousel__dots:nth-child(2)');

    await browser.pause(1000);
    await browser.assertView('select slide by clicking on dot', ['.BrainhubCarousel']);
  });

  it('changes slide on thumbnail click', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/thumbnails');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.click('.BrainhubCarousel__dots:nth-child(2)');

    await browser.pause(1000);
    await browser.assertView('select slide by clicking on thumbnail', ['.BrainhubCarousel']);
  });

  it('repeats slides', async function() {
    const browser = this.browser;

    await browser.url('/docs/examples/infinite');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    for (let i = 0; i < 15; i++) {
      await browser.click('.BrainhubCarousel__arrowRight');
    }

    await browser.pause(1000);
    await browser.assertView('infinite scroll', ['.BrainhubCarousel']);
  });
});
