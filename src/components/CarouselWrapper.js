import React, { Component } from 'react';
import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';

import Carousel from './Carousel';

class CarouselWrapper extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onChange = value => this.setState({ value });

  render() {
    const { value, onChange, ...rest } = this.props;
    const isControlled = !isNil(value);
    return (
      <Carousel
        value={isControlled ? parseInt(value) : this.state.value}
        onChange={isControlled ? onChange : this.onChange}
        {...rest}
      />
    );
  }
}

export default CarouselWrapper;
