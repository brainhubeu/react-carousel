import React, { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import classnames from 'classnames';

import { pluginNames } from '../constants/plugins';
import { slidesState } from '../state/atoms/slideAtoms';

import './arrows.scss';

/**
 * Adds onClick handler to the arrow if possible (if it does not already have one)
 * @param {ReactElement} element to render
 * @param {function} onClick handler to be added to element
 * @param {string} name of an element
 * @param {boolean} addArrowClickHandler decide whether to add action to onClick
 * @param {string} key unique element key
 * @param {boolean} disable info whether the arrow is disabled
 * @return {ReactElement} element with added handler
 */
const renderArrowWithAddedHandler = (
  element,
  onClick,
  name,
  addArrowClickHandler,
  key,
  disable = false,
) => (
  <div
    key={key}
    className={classnames(
      'BrainhubCarousel__customArrows',
      {
        'BrainhubCarousel__arrow--disable': disable,
      },
      `BrainhubCarousel__custom-${name}`,
    )}
    onClick={addArrowClickHandler ? onClick : null}
  >
    {element}
  </div>
);

const arrows = ({ carouselProps, options = {} }) => ({
  name: pluginNames.ARROWS,
  // eslint-disable-next-line react/display-name
  beforeCarouselItems: () => {
    const slides = useRecoilValue(slidesState);

    const prevSlide = useCallback(
      () => carouselProps.onChange(carouselProps.value - 1),
      [carouselProps.value, carouselProps.onChange],
    );

    const disabled =
      carouselProps.value <= 0 &&
      carouselProps?.children?.length === slides.length;

    if (options.arrowLeft) {
      if (!disabled) {
        return renderArrowWithAddedHandler(
          options.arrowLeft,
          prevSlide,
          'arrowLeft',
          options.addArrowClickHandler,
          '@brainhubeu/react-carousel/custom-arrow-left',
        );
      }
      const arrow = options.arrowLeftDisabled
        ? options.arrowLeftDisabled
        : options.arrowLeft;
      return renderArrowWithAddedHandler(
        arrow,
        prevSlide,
        'arrowLeft',
        options.addArrowClickHandler,
        '@brainhubeu/react-carousel/custom-arrow-left',
        disabled,
      );
    }
    return (
      <button
        key={'@brainhubeu/react-carousel/arrow-left'}
        className="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"
        onClick={prevSlide}
        disabled={disabled}
      >
        <span>prev</span>
      </button>
    );
  },
  // eslint-disable-next-line react/display-name
  afterCarouselItems: () => {
    const slides = useRecoilValue(slidesState);

    const nextSlide = useCallback(
      () => carouselProps.onChange(carouselProps.value + 1),
      [carouselProps.value, carouselProps.onChange],
    );

    const disabled =
      carouselProps.value >= slides.length - 1 &&
      carouselProps?.children?.length === slides.length;

    if (options.arrowRight) {
      if (!disabled) {
        return renderArrowWithAddedHandler(
          options.arrowRight,
          nextSlide,
          'arrowLeft',
          options.addArrowClickHandler,
          '@brainhubeu/react-carousel/custom-arrow-right',
        );
      }
      const arrow = options.arrowRightDisabled
        ? options.arrowRightDisabled
        : options.arrowRight;
      return renderArrowWithAddedHandler(
        arrow,
        nextSlide,
        'arrowLeft',
        options.addArrowClickHandler,
        '@brainhubeu/react-carousel/custom-arrow-right',
        disabled,
      );
    }
    return (
      <button
        key={'@brainhubeu/react-carousel/arrow-right'}
        className="BrainhubCarousel__arrows BrainhubCarousel__arrowRight"
        onClick={nextSlide}
        disabled={disabled}
      >
        <span>next</span>
      </button>
    );
  },
});

export default arrows;
