import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/CarouselItem.scss';

export default class CarouselItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    width: PropTypes.number,
  };
  render() {
    return (
      <li className="BrainhubCarouselItem" style={{ width: `${this.props.width}px` }}>
        {this.props.children}
      </li>
    );
  }
}
