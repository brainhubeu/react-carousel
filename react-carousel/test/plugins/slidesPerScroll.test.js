import setupCarousel from '../tools/setupCarousel';
import slidesToScroll from '../../src/plugins/slidesToScroll';

describe('slidesPerScroll plugin', () => {
  test('slides forward as many slides as described in plugin options', () => {
    const wrapper = setupCarousel({
      plugins: [
        'arrows',
        {
          resolve: slidesToScroll,
          options: {
            numberOfSlides: 2,
          },
        },
      ],
    });

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(0)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__arrowRight').simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(2)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });

  test('slides backward as many slides as described in plugin options', () => {
    const wrapper = setupCarousel({
      plugins: [
        'arrows',
        {
          resolve: slidesToScroll,
          options: {
            numberOfSlides: 2,
          },
        },
      ],
    });

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(0)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__arrowRight').simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(2)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__arrowLeft').simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(0)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });

  test('goes to the last slide if numberOfSlides exceeds the total number of slides', () => {
    const wrapper = setupCarousel({
      plugins: [
        'arrows',
        {
          resolve: slidesToScroll,
          options: {
            numberOfSlides: 5,
          },
        },
      ],
    });

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(0)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__arrowRight').simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(2)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });
});
