import setupCarousel from '../tools/setupCarousel';

describe('infinite', () => {
  it('renders additional clones when in infinite mode', () => {
    const wrapper = setupCarousel({
      plugins: ['infinite'],
    });

    expect(wrapper.find('.BrainhubCarouselItem')).toHaveLength(15);
  });
});
