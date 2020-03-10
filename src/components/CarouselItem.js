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
    slidesPerPage: PropTypes.number,
    carouselIsCentered: PropTypes.bool,
  };

  onMouseDown = event => {
    this.props.onMouseDown(event, this.props.index);
  };

  onTouchStart = event => {
    this.props.onTouchStart(event, this.props.index);
  };

  getIsVisible() {
    if (this.props.carouselIsCentered) {
      const itemsConsidered = this.props.slidesPerPage % 2 === 0
        ? this.props.slidesPerPage - 1 : this.props.slidesPerPage;

      const itemsRange = itemsConsidered / 2;

      return this.props.index >= this.props.currentSlideIndex - itemsRange
        && this.props.index <= this.props.currentSlideIndex + itemsRange;
    } else {
      return this.props.index >= this.props.currentSlideIndex
          && this.props.index < Math.floor(this.props.currentSlideIndex + this.props.slidesPerPage);
    }
  }

  render() {
    return (
      <li
        className={classname(
          'BrainhubCarouselItem',
          {
            'BrainhubCarouselItem--clickable': this.props.clickable,
            'BrainhubCarouselItem--active': this.props.index === this.props.currentSlideIndex,
            'BrainhubCarouselItem--visible': this.getIsVisible(),
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
