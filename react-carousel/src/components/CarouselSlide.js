import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';

import '../styles/CarouselItem.scss';

const CarouselSlide = ({
  index,
  onMouseDown,
  onTouchStart,
  currentSlideIndex,
  isDraggingEnabled,
  itemClassNames,
  width,
  offset,
  isDragging,
  children,
}) => {
  const childrenRef = useRef(null);
  const isInitialMount = useRef(true);

  const resizeChildren = () => {
    if (childrenRef.current) {
      childrenRef.current.style = null;
      if (childrenRef.current.offsetWidth > width) {
        childrenRef.current.style.width = `${width}px`;
      }
    }
  };

  const observeWidth = () => {
    const resizeObserver = new ResizeObserver(() => {
      resizeChildren();
      childrenRef.current && resizeObserver.unobserve(childrenRef.current);
    });
    childrenRef.current && resizeObserver.observe(childrenRef.current);
  };

  const getChildren = () =>
    childrenRef.current
      ? React.cloneElement(children, { ref: childrenRef })
      : children;

  const onItemMouseDown = (event) => {
    onMouseDown(event, index);
  };

  const onItemTouchStart = (event) => {
    onTouchStart(event, index);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      observeWidth();
    }
  }, []);

  useEffect(() => {
    resizeChildren();
  }, [width]);

  return (
    <li
      className={classname(
        'BrainhubCarouselItem',
        {
          'BrainhubCarouselItem--active': index === currentSlideIndex,
        },
        ...(itemClassNames || []),
      )}
      style={{
        marginRight: `${offset / 2}px`,
        marginLeft: `${offset / 2}px`,
        width: `${width}px`,
        maxWidth: `${width}px`,
        minWidth: `${width}px`,
        pointerEvents: isDragging ? 'none' : null,
      }}
      onMouseDown={isDraggingEnabled ? onItemMouseDown : null}
      onTouchStart={isDraggingEnabled ? onItemTouchStart : null}
    >
      {getChildren()}
    </li>
  );
};

CarouselSlide.propTypes = {
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
  itemClassNames: PropTypes.arrayOf(PropTypes.string),
};

export default memo(CarouselSlide);
