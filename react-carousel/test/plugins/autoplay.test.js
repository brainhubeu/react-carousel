import { autoplayPlugin } from '../../src';
import setupCarousel from '../tools/setupCarousel';

describe('autoplay', () => {
  test('clears interval on unmount when autoplay was enabled', () => {
    jest.useFakeTimers();

    const wrapper = setupCarousel({
      plugins: ['autoplay'],
      animationSpeed: 1,
    });

    wrapper.unmount();

    expect(clearInterval).toHaveBeenCalled();
  });

  test('changes slides automatically', () => {
    jest.useFakeTimers();

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });

    const wrapper = setupCarousel({
      plugins: [
        {
          resolve: autoplayPlugin,
          options: {
            interval: 10,
          },
        },
      ],
      animationSpeed: 1,
    });

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(0)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    jest.advanceTimersByTime(11);

    wrapper.update();

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(1)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });
});
