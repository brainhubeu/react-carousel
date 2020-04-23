import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import '../styles/CarouselDots.scss';

class CarouselDots extends Component {
  static propTypes = {
    number: PropTypes.number,
    thumbnails: PropTypes.arrayOf(PropTypes.node),
    value: PropTypes.number,
    onChange: PropTypes.func,
    rtl: PropTypes.bool,
    vertical: PropTypes.bool,
    className: PropTypes.string,
  };

  onChange = index => () => {
    const numberOfSlides = this.props.number || this.props.thumbnails.length;
    const moduloItem = this.calculateButtonValue() % numberOfSlides;

    return this.props.onChange(this.props.value - ( moduloItem - index));
  };

  calculateButtonValue = () => {
    const numberOfSlides = this.props.number || this.props.thumbnails.length;
    return this.props.value >= 0
      ? this.props.value
      : this.props.value + numberOfSlides * Math.ceil(Math.abs(this.props.value/numberOfSlides));
  };

  renderCarouselDots() {
    if (this.props.thumbnails) {
      const dotsLength = isNaN(this.props.number) ? this.props.thumbnails.length : this.props.number;

      return this.props.thumbnails.slice(0, dotsLength).map((thumbnail, index) => (
        <li key={index}>
          <div
            className={classnames(
              'BrainhubCarousel__thumbnail',
              {
                'BrainhubCarousel__thumbnail--selected': index === this.calculateButtonValue() % dotsLength,
                'BrainhubCarousel__thumbnail--vertical': this.props.vertical,
              },
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
              { 'BrainhubCarousel__dot--selected': i === this.calculateButtonValue() % this.props.number },
            )}
            type="button"
            onClick={this.onChange(i)}
          >
            {i + 1}
          </div>
        </li>,
      );
    }
    return dots;
  }

  render() {
    const { className, rtl } = this.props;
    return (
      <ul className={classnames('BrainhubCarousel__dots', className, rtl ? 'BrainhubCarousel__dots--isRTL' : '')}>
        {this.renderCarouselDots()}
      </ul>
    );
  }
}

export default CarouselDots;
