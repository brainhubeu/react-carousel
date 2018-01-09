import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import '../styles/CarouselItem.scss';

export default class CarouselItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    onMouseDown: PropTypes.func,
    onTouchStart: PropTypes.func,
    clickable: PropTypes.bool,
    children: PropTypes.node,
    width: PropTypes.number,
  };

  onMouseDown = event => {
    this.props.onMouseDown(event, this.props.index);
  };

  onTouchStart = event => {
    this.props.onTouchStart(event, this.props.index);
  };

  render() {
    return (
      <li
        className={classname('BrainhubCarouselItem', { 'BrainhubCarouselItem--clickable': this.props.clickable })}
        style={{ width: `${this.props.width}px` }}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
      >
        {this.props.children}
      </li>
    );
  }
}
