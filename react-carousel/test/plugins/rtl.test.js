import setupCarousel from '../tools/setupCarousel';

describe('rtl', () => {
  test('adds BrainhubCarousel--isRTL when in RTL mode', () => {
    const wrapper = setupCarousel({
      plugins: ['rtl'],
    });

    expect(wrapper.find('.BrainhubCarousel--isRTL')).toHaveLength(1);
  });

  test('left arrow is initially enabled with rtl plugin', () => {
    const wrapper = setupCarousel({
      plugins: ['rtl', 'arrows'],
    });

    expect(
      wrapper.find('.BrainhubCarousel__arrowLeft').props().disabled,
    ).toBeTruthy();
    expect(
      wrapper.find('.BrainhubCarousel__arrowRight').props().disabled,
    ).toBeFalsy();
  });
});
