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
    widthUnit: PropTypes.string,
    offset: PropTypes.number,
    offsetUnit: PropTypes.string,
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
          paddingRight: `${this.props.offset / 2}${this.props.offsetUnit}`,
          paddingLeft: `${this.props.offset / 2}${this.props.offsetUnit}`,
          width: `${this.props.width}${this.props.widthUnit}`,
          maxWidth: `${this.props.width}${this.props.widthUnit}`,
          minWidth: `${this.props.width}${this.props.widthUnit}`,
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
