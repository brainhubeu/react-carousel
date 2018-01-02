import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CarouselItem from './CarouselItem';

export default class Carousel extends Component {
  static propTypes = {
    carouselItems: PropTypes.arrayOf(PropTypes.node),
  };

  renderCarouselItems() {
    return this.props.carouselItems.map((carouselItem, index) => (
      <CarouselItem key={index} carouselItem={carouselItem} />
    ));
  }

  render() {
    return (
      <div>
        {this.renderCarouselItems()}
      </div>
    );
  }
}
