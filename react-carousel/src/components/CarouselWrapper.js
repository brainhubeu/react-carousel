import React from 'react';
import { useRecoilValue, RecoilRoot, useSetRecoilState } from 'recoil';
import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';

import { carouselValueState, getCurrentValueSelector } from '../state/carousel';

import Carousel from './Carousel';

const CarouselWrapper = props => {
  const setBuiltinValue = useSetRecoilState(getCurrentValueSelector);
  const builtinValue = useRecoilValue(carouselValueState);

  const { onChange, value, ...rest } = props;

  const isControlled = !isNil(value);
  return (
    <Carousel
      value={isControlled ? parseInt(value) : builtinValue}
      onChange={isControlled ? onChange : setBuiltinValue}
      {...rest}
    />
  );
};

CarouselWrapper.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

const RecoiledComponent = props => (
  <RecoilRoot>
    <CarouselWrapper {...props}/>
  </RecoilRoot>
);

export default RecoiledComponent;
