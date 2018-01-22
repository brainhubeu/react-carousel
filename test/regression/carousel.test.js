/* eslint no-undef: 0 */

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
      const buttonRight = find('.fa-arrow-right');
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.click(buttonRight);
      actions.wait(1000);
    });
});
