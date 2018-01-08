import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import '../styles/CarouselDots.scss';

export default class CarouselDots extends Component {
  static propTypes = {
    number: PropTypes.number,
    thumbnails: PropTypes.arrayOf(PropTypes.node),
    value: PropTypes.number,
    onChange: PropTypes.func,
  };

  onChange = index => () => this.props.onChange(index);

  renderCarouselDots() {
    if (this.props.thumbnails) {
      return this.props.thumbnails.map((thumbnail, index) => (
        <li key={index}>
          <div
            className={classnames(
              'BrainhubCarousel__thumbnail',
              { 'BrainhubCarousel__thumbnail--selected': index === this.props.value }
            )}
            type="button"
            onClick={this.onChange(index)}
          >
            {thumbnail}
          </div>
        </li>
      ));
    }
    const dots = [];
    for (let i = 0; i < this.props.number; i++) {
      dots.push(
        <li key={i}>
          <div
            className={classnames(
              'BrainhubCarousel__dot',
              { 'BrainhubCarousel__dot--selected': i === this.props.value }
            )}
            type="button"
            onClick={this.onChange(i)}
          >
            {i + 1}
          </div>
        </li>
      );
    }
    return dots;
  }

  render() {
    return (
      <ul className="BrainhubCarousel__dots">
        {this.renderCarouselDots()}
      </ul>
    );
  }
}
