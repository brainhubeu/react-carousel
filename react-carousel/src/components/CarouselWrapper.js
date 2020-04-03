import React, { useState } from 'react';
import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';

import Carousel from './Carousel';

const CarouselWrapper = props => {
  const [builtinValue, setBuiltinValue] = useState(0);

  const onValueChange = value => {
    setBuiltinValue(value);
  };

  const { onChange, value, ...rest } = props;

  const isControlled = !isNil(value);
  return (
    <Carousel
      value={isControlled ? parseInt(value) : builtinValue}
      onChange={isControlled ? onChange : onValueChange}
      {...rest}
    />
  );
};

CarouselWrapper.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export default CarouselWrapper;
