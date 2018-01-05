import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/CarouselDots.scss';

export default class CarouselDots extends Component {
  static propTypes = {
    indicators: PropTypes.node.isRequired,
    currentItem: PropTypes.number.isRequired,
  };

  renderCarouselDots() {
    return this.props.indicators.map((carouselItem, index) => (
      <li key={index}>
        <button
          className={index === this.props.currentItem && 'brainhub-carousel__dots--selected'}
        >
          {index + 1}
        </button>
      </li>
    ));
  }

  render() {
    return (
      <ul className="brainhub-carousel__dots">
        {this.renderCarouselDots()}
      </ul>
    );
  }
}
