/* eslint-disable import/first */
if (!String.prototype.endsWith) {
  // eslint-disable-next-line no-extend-native
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import '../styles/CarouselItem.scss';

class CarouselItem extends PureComponent {
  static propTypes = {
    onMouseDown: PropTypes.func,
    onTouchStart: PropTypes.func,
    clickable: PropTypes.bool,
    children: PropTypes.node,
    width: PropTypes.number,
    offset: PropTypes.number,
    index: PropTypes.number,
    currentSlideIndex: PropTypes.number,
    isDragging: PropTypes.bool,
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
        className={classname(
          'BrainhubCarouselItem',
          {
            'BrainhubCarouselItem--clickable': this.props.clickable,
            'BrainhubCarouselItem--active': this.props.index === this.props.currentSlideIndex,
          },
        )}
        style={{
          paddingRight: `${this.props.offset / 2}px`,
          paddingLeft: `${this.props.offset / 2}px`,
          width: `${this.props.width}px`,
          maxWidth: `${this.props.width}px`,
          minWidth: `${this.props.width}px`,
          pointerEvents: this.props.isDragging ? 'none' : null,
        }}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
      >
        {this.props.children}
      </li>
    );
  }
}

export default CarouselItem;
