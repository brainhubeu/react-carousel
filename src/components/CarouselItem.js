import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import '../styles/CarouselItem.scss';

export default class CarouselItem extends Component {
  static propTypes = {
    onMouseDown: PropTypes.func,
    onTouchStart: PropTypes.func,
    clickable: PropTypes.bool,
    children: PropTypes.node,
    width: PropTypes.number,
  };
  render() {
    return (
      <li
        className={classname('BrainhubCarouselItem', { 'BrainhubCarouselItem--clickable': this.props.clickable })}
        style={{ width: `${this.props.width}px` }}
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
      >
        {this.props.children}
      </li>
    );
  }
}
