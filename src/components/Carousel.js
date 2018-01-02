import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CarouselItem from './CarouselItem';
import '../styles/Carousel.scss';
import classnames from 'classnames';

export default class Carousel extends Component {
  static propTypes = {
    carouselItems: PropTypes.arrayOf(PropTypes.node),
    additionalContainerClassName: PropTypes.string,
  };

  renderCarouselItems() {
    return this.props.carouselItems.map((carouselItem, index) => (
      <CarouselItem key={index} carouselItem={carouselItem} />
    ));
  }

  render() {
    return (
      <div className={classnames('brainhub-carousel-items-container', this.props.additionalContainerClassName)}>
        {this.renderCarouselItems()}
      </div>
    );
  }
}
