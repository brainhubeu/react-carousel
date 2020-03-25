import React, { useState } from 'react';
import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';

import Carousel from './Carousel';

export const CarouselContext = React.createContext({
  carouselProps: {
    width: 0,
  },
  setCarouselProps: () => {},
});

const CarouselWrapper = props => {
  const [builtinValue, setBuiltinValue] = useState(0);
  const [carouselProps, setCarouselProps] = useState({
    carouselWidth: 0,
    itemWidth: 0,
  });

  const carouselPropsValues = { carouselProps, setCarouselProps };

  const onValueChange = value => {
    setBuiltinValue(value);
  };

  const { onChange, value, ...rest } = props;
  const isControlled = !isNil(value);
  return (
    <CarouselContext.Provider value={carouselPropsValues}>
      <Carousel
        value={isControlled ? parseInt(value) : builtinValue}
        onChange={isControlled ? onChange : onValueChange}
        {...rest}
      />
    </CarouselContext.Provider>
  );
};

CarouselWrapper.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export default CarouselWrapper;
