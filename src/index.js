import React from 'react';
import Carousel from './components/Carousel';
import PropTypes from 'prop-types';

export default class BrainhubCarousel extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    additionalContainerClassName: PropTypes.string,
  }

  render() {
    return (
      <Carousel
        carouselItems={this.props.children}
        additionalContainerClassName={this.props.additionalContainerClassName}
      />
    );
  }
}
