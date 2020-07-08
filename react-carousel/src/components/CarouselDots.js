import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import '../styles/CarouselDots.scss';

const CarouselDots = ({
  value,
  thumbnails,
  number,
  onChange,
  rtl,
  className,
}) => {
  const calculateButtonValue = () => {
    const numberOfSlides = number || thumbnails.length;
    return value >= 0
      ? value
      : value + numberOfSlides * Math.ceil(Math.abs(value / numberOfSlides));
  };

  const onDotClick = (index) => () => {
    const numberOfSlides = number || thumbnails.length;
    const moduloItem = calculateButtonValue() % numberOfSlides;

    return onChange(value - (moduloItem - index));
  };

  const renderCarouselDots = () => {
    if (thumbnails) {
      const dotsLength = isNaN(number) ? thumbnails.length : number;

      return thumbnails.slice(0, dotsLength).map((thumbnail, index) => (
        <li key={index}>
          <div
            className={classnames('BrainhubCarousel__thumbnail', {
              'BrainhubCarousel__thumbnail--selected':
                index === calculateButtonValue() % dotsLength,
            })}
            type="button"
            onClick={onDotClick(index)}
          >
            {thumbnail}
          </div>
        </li>
      ));
    }

    const dots = [];
    for (let i = 0; i < number; i++) {
      dots.push(
        <li key={i}>
          <div
            className={classnames('BrainhubCarousel__dot', {
              'BrainhubCarousel__dot--selected':
                i === calculateButtonValue() % number,
            })}
            type="button"
            onClick={onDotClick(i)}
          >
            {i + 1}
          </div>
        </li>,
      );
    }
    return dots;
  };

  return (
    <ul
      className={classnames(
        'BrainhubCarousel__dots',
        className,
        rtl ? 'BrainhubCarousel__dots--isRTL' : '',
      )}
    >
      {renderCarouselDots()}
    </ul>
  );
};

CarouselDots.propTypes = {
  number: PropTypes.number,
  thumbnails: PropTypes.arrayOf(PropTypes.node),
  value: PropTypes.number,
  onChange: PropTypes.func,
  rtl: PropTypes.bool,
  className: PropTypes.string,
};

export default React.memo(CarouselDots);
