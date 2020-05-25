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
    id: PropTypes.number,
    currentSlideIndex: PropTypes.number,
    isDragging: PropTypes.bool,
    isDraggingEnabled: PropTypes.bool,
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
      resizeObserver.unobserve(this.childrenRef.current);
    });
    resizeObserver.observe(this.childrenRef.current);
  }

  resizeChildren() {
    this.childrenRef.current.style = null;
    if (this.childrenRef.current.offsetWidth > this.props.width) {
      this.childrenRef.current.style.width = `${this.props.width}px`;
    }
  }

  getChildren() {
    return React.cloneElement(
      this.props.children,
      { ref: this.childrenRef },
    );
  }

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
        onMouseDown={this.props.isDraggingEnabled ? this.onMouseDown : null}
        onTouchStart={this.props.isDraggingEnabled ? this.onTouchStart : null}
      >
        {this.getChildren()}
      </li>
    );
  }
}

export default CarouselItem;
