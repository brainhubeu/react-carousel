import React, { useCallback, useState } from 'react';
import { mount } from 'enzyme';

import { Dots } from '../../src';
import CarouselWrapper from '../../src/components/CarouselWrapper';

const CarouselWithDots = () => {
  const [value, setValue] = useState(0);

  const onChange = useCallback(
    (value) => {
      setValue(value);
    },
    [setValue],
  );

  const slides = Array.from({ length: 5 }, (val, index) => <div key={index} />);

  return (
    <div>
      <CarouselWrapper value={value} onChange={onChange} slides={slides} />
      <Dots value={value} onChange={onChange} number={slides.length} />
    </div>
  );
};

const CarouselWithThumbnails = () => {
  const [value, setValue] = useState(0);

  const onChange = useCallback(
    (value) => {
      setValue(value);
    },
    [setValue],
  );

  const slides = Array.from({ length: 5 }, (val, index) => <div key={index} />);

  return (
    <div>
      <CarouselWrapper value={value} onChange={onChange} slides={slides} />
      <Dots
        value={value}
        onChange={onChange}
        thumbnails={slides}
        number={slides.length}
      />
    </div>
  );
};

describe('dots', () => {
  test('renders dots', () => {
    const wrapper = mount(<CarouselWithDots />);

    expect(wrapper.find('.BrainhubCarousel__dot')).toHaveLength(5);
  });

  test('changes slide on dot click', () => {
    const wrapper = mount(<CarouselWithDots />);

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .first()
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__dot').at(1).simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(1)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });

  test('changes slide on thumbnail click', () => {
    const wrapper = mount(<CarouselWithThumbnails />);

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .first()
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();

    wrapper.find('.BrainhubCarousel__thumbnail').at(1).simulate('click');

    expect(
      wrapper
        .find('.BrainhubCarouselItem')
        .at(1)
        .hasClass('BrainhubCarouselItem--active'),
    ).toBeTruthy();
  });
});
