import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import '../styles/CarouselItem.scss';
import ResizeObserver from 'resize-observer-polyfill';

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
    isDraggingEnabled: PropTypes.bool,
    slidesPerPage: PropTypes.number,
    carouselIsCentered: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.childrenRef = React.createRef();
  }

  /* ========== Resize, if necessary. Workaround for iOS safari ========== */
  componentDidMount() {
    this.observeWidth();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width) {
      this.resizeChildren();
    }
  }

  observeWidth() {
    const resizeObserver = new ResizeObserver(() => {
      this.resizeChildren();
      this.childrenRef.current && resizeObserver.unobserve(this.childrenRef.current);
    });
    this.childrenRef.current && resizeObserver.observe(this.childrenRef.current);
  }

  resizeChildren() {
    if (this.childrenRef.current) {
      this.childrenRef.current.style = null;
      if (this.childrenRef.current.offsetWidth > this.props.width) {
        this.childrenRef.current.style.width = `${this.props.width}px`;
      }
    }
  }

  getChildren() {
    if (this.childrenRef.current) {
      return React.cloneElement(
        this.props.children,
        { ref: this.childrenRef },
      );
    }
    return this.props.children;
  }

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
          marginLeft: `${this.props.offset / 2}px`,
          marginRight: `${this.props.offset / 2}px`,
          width: `${this.props.width}px`,
          maxWidth: `${this.props.width}px`,
          minWidth: `${this.props.width}px`,
          pointerEvents: this.props.isDragging ? 'none' : null,
        }}
        onMouseDown={this.props.isDraggingEnabled ? this.onMouseDown : null}
        onTouchStart={this.props.isDraggingEnabled ? this.onTouchStart : null}
      >
        {this.getChildren()}
      </li>
    );
  }
}

export default CarouselItem;
