import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CarouselItem extends Component {
  static propTypes = {
    carouselItem: PropTypes.node,
  };
  render() {
    return (
      <div>
        {this.props.carouselItem}
      </div>
    );
  }
}
