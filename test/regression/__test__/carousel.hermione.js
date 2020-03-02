'use strict';

it('Slide', async function() {
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
  await browser.click('.BrainhubCarousel__arrowRight');
  await browser.pause(1000);
  await browser.assertView('rightArrowPressed', ['.BrainhubCarousel']);
  await browser.click('.BrainhubCarousel__arrowLeft');
  await browser.pause(1000);
  await browser.assertView('leftArrowPressed', ['.BrainhubCarousel']);
});
// it("BrainhubCarouselControlled", async function () {
//   const browser = this.browser;
//   await browser.url("/controlled");
//   await browser.pause(1000);
//   await browser.assertView("plain", [".Section__content"]);
//   // Focus
//   await browser.execute(function () {
//     document.querySelector('input').focus();
//   });
//   // Press keys: ArrowRight
//   await browser.keys("\uE014");
//   // Focus
//   await browser.execute(function () {
//     document.querySelector('input').focus();
//   });
//   // Press keys:
//   await browser.keys("5");
//   await browser.pause(1000);
//   await browser.assertView("leftArrowPressed", [".Section__content"]);
// });
// it("BrainhubCarouselClickToChange", async function () {
//   const browser = this.browser;
//   await browser.url("/clicktochange");
//   await browser.pause(1000);
//   await browser.assertView("plain", [".Section__content"]);
//   await browser.click(".BrainhubCarousel");
//   await browser.pause(1000);
//   await browser.assertView("item clicked", [".Section__content"]);
// });
// it("BrainhubCarouselAutoplay", async function () {
//   const browser = this.browser;
//   await browser.url("/autoplay");
//   await browser.pause(1000);
//   await browser.assertView("plain", [".Section__content"]);
//   await browser.pause(1500);
//   await browser.assertView("autoPlay", [".Section__content"]);
// });
// it("BrainhubCarouselDots", async function () {
//   const browser = this.browser;
//   await browser.url("/dots");
//   await browser.pause(1000);
//   await browser.assertView("plain", [".Section__content"]);
//   await browser.click(".BrainhubCarousel__dots");
//   await browser.pause(1000);
//   await browser.assertView("select slide by clicking on dot", [".Section__content"]);
//   await browser.click(".BrainhubCarousel__thumbnail");
//   await browser.pause(1000);
//   await browser.assertView("select slide by clicking on thumbnail", [".Section__content"]);
// });
// it("BrainhubCarouselInfinite", async function () {
//   const browser = this.browser;
//   await browser.url("/infinite");
//   await browser.pause(1000);
//   await browser.assertView("plain", [".Section__content"]);
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.click(".BrainhubCarousel__arrowRight");
//   await browser.pause(1000);
//   await browser.assertView("infinite scroll", [".Section__content"]);
// });

/*
test/regression/__test__/carousel.gemini.js

/* eslint no-undef: 0 * /

gemini.suite('BrainhubCarouselArrows', suite => {
  suite.setUrl('/arrows')
    .setCaptureElements('.Section__content')
    .capture('plain', actions => {
      actions.wait(1000);
    })
    .capture('Carousel swipe right', (actions, find) => {
      const carousel = find('.img-example');
      const buttonRight = find('.fa-arrow-right');
      actions.mouseDown(carousel, 0);
      actions.mouseMove(buttonRight, 0);
      actions.mouseUp(carousel, 0);
      actions.wait(1000);
    })
    .capture('rightArrowPressed', (actions, find) => {
      const buttonRight = find('.fa-arrow-right');
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.wait(1000);
    })
    .capture('leftArrowPressed', (actions, find) => {
      const buttonLeft = find('.fa-arrow-left');
      actions.click(buttonLeft);
      actions.wait(1000);
    });
});

gemini.suite('BrainhubCarouselControlled', suite => {
  suite.setUrl('/controlled')
    .setCaptureElements('.Section__content')
    .capture('plain', actions => {
      actions.wait(1000);
    })
    .capture('leftArrowPressed', (actions, find) => {
      const input = find('input');
      actions.sendKeys(input, gemini.ARROW_RIGHT);
      actions.sendKeys(input, '5');
      actions.wait(1000);
    });
});

gemini.suite('BrainhubCarouselClickToChange', suite => {
  suite.setUrl('/clicktochange')
    .setCaptureElements('.Section__content')
    .capture('plain', actions => {
      actions.wait(1000);
    })
    .capture('item clicked', (actions, find) => {
      const carouselItem = find('.BrainhubCarousel');
      actions.click(carouselItem);
      actions.wait(1000);
    });
});

gemini.suite('BrainhubCarouselAutoplay', suite => {
  suite.setUrl('/autoplay')
    .setCaptureElements('.Section__content')
    .capture('plain', actions => {
      actions.wait(1000);
    })
    .capture('autoPlay', actions => {
      actions.wait(1500);
    });
});

gemini.suite('BrainhubCarouselDots', suite => {
  suite.setUrl('/dots')
    .setCaptureElements('.Section__content')
    .capture('plain', actions => {
      actions.wait(1000);
    })
    .capture('select slide by clicking on dot', (actions, find) => {
      const carouselDots = find('.BrainhubCarousel__dots');
      actions.click(carouselDots);
      actions.wait(1000);
    })
    .capture('select slide by clicking on thumbnail', (actions, find) => {
      const carouselThumbnail = find('.BrainhubCarousel__thumbnail');
      actions.click(carouselThumbnail);
      actions.wait(1000);
    });
});


gemini.suite('BrainhubCarouselInfinite', suite => {
  suite.setUrl('/infinite')
    .setCaptureElements('.Section__content')
    .capture('plain', actions => {
      actions.wait(1000);
    })
    .capture('infinite scroll', (actions, find) => {
      const buttonRight = find('.BrainhubCarousel__arrowRight');
      for (let i = 0; i < 15; i++) {
        actions.click(buttonRight);
      }
      actions.wait(1000);
    });
});

*/
