import { useContext, useEffect } from 'react';

import { CarouselContext } from '../components/CarouselWrapper';

const slidesPerPage = ({ numberOfSlides }) => {
  const { carouselProps, setCarouselProps } = useContext(CarouselContext);

  useEffect(() => {
    setCarouselProps({
      ...carouselProps,
      itemWidth: carouselProps.itemWidth/numberOfSlides,
    });
  }, [carouselProps.carouselWidth]);
};

export default slidesPerPage;
