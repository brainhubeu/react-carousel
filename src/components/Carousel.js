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

  renderCarouselDots() {
    return this.props.carouselItems.map((carouselItem, index) => (
      <li><button>{index + 1}</button></li>
    ));
  }

  render() {
    return (
      <div className={classnames('brainhub-carousel', this.props.additionalContainerClassName)}>
        <button className="brainhub-carousel__arrows brainhub-carousel__arrow-left" type="button">Prev</button>
        <ul className="brainhub-carousel__track">
          {this.renderCarouselItems()}
        </ul>
        <button className="brainhub-carousel__arrows brainhub-carousel__arrow-right" type="button">Next</button>
        <ul className="brainhub-carousel__dots">
          {this.renderCarouselDots()}
        </ul>
      </div>
    );
  }
}
