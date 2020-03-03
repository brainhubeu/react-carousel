/* eslint-disable babel/no-invalid-this */
'use strict';

describe('React Carousel', () => {
  it('should swipe slide', async function() {
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

  it('should change slide when clicking on the arrow', async function() {
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

  it('Should go to slide typed in the input', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/controlled');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);
    // Focus
    await browser.execute(function() {
      document.querySelector('input').focus();
    });
    // Press keys: ArrowRight
    await browser.keys('\uE014');
    // Focus
    await browser.execute(function() {
      document.querySelector('input').focus();
    });
    // Press keys:
    await browser.keys('2');

    await browser.pause(1000);
    await browser.assertView('MoveToThirdSlide', ['.BrainhubCarousel']);
  });

  it('Should change slide on next slide click', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/clickToChange');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.click('.BrainhubCarouselItem:nth-child(2)');

    await browser.pause(1000);
    await browser.assertView('item clicked', ['.BrainhubCarousel']);
  });

  it('Should automatically change slides ', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/animation');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.pause(2400);
    await browser.assertView('autoPlay 2 slides later', ['.BrainhubCarousel']);
  });

  it('Should change slide on dot click', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/dots');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.click('.BrainhubCarousel__dots:nth-child(2)');

    await browser.pause(1000);
    await browser.assertView('select slide by clicking on dot', ['.BrainhubCarousel']);
  });

  it('Should change slide on thumbnail click', async function() {
    const browser = this.browser;
    await browser.url('/docs/examples/thumbnails');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    await browser.click('.BrainhubCarousel__dots:nth-child(2)');

    await browser.pause(1000);
    await browser.assertView('select slide by clicking on thumbnail', ['.BrainhubCarousel']);
  });

  it('Should repeat slides', async function() {
    const browser = this.browser;

    await browser.url('/docs/examples/infinite');
    await browser.pause(1000);

    await browser.assertView('plain', ['.BrainhubCarousel']);

    /* eslint-disable-next-line no-unused-vars */
    for (const _ of Array.from({ length: 15 })) {
      await browser.click('.BrainhubCarousel__arrowRight');
    }

    await browser.pause(1000);
    await browser.assertView('infinite scroll', ['.BrainhubCarousel']);
  });
});
