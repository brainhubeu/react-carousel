import { useEffect } from 'react';


const slidesPerPage = ({ options, state }) => {
  useEffect(() => {
    const itemWidth = state.get.itemWidth || state.get.carouselWidth;
    state.set.setItemWidth(itemWidth/options.numberOfSlides);
  }, [state.get.carouselWidth]);
};

export default slidesPerPage;
