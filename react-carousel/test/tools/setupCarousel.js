import React from 'react';
import { mount } from 'enzyme';

import CarouselWrapper from '../../src/components/CarouselWrapper';

const setup = (options = {}) =>
  mount(
    <CarouselWrapper {...options}>
      <div
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'red',
        }}
      />
      <div
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'blue',
        }}
      />
      <div
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'yellow',
        }}
      />
    </CarouselWrapper>,
  );

export default setup;
