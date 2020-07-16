import pluginsFunc from '../plugins';

const {
  slidesToShow,
  infinite,
  clickToChange,
  autoplay,
  rtl,
  centered,
  slidesToScroll,
  arrows,
  fastSwipe,
} = pluginsFunc;

export const pluginNames = {
  SLIDES_TO_SHOW: 'SLIDESTOSHOW',
  CLICK_TO_CHANGE: 'CLICKTOCHANGE',
  INFINITE: 'INFINITE',
  AUTOPLAY: 'AUTOPLAY',
  RTL: 'RTL',
  CENTERED: 'CENTERED',
  SLIDES_TO_SCROLL: 'SLIDESTOSCROLL',
  ARROWS: 'ARROWS',
  FAST_SWIPE: 'FASTSWIPE',
};

export const plugins = {
  [pluginNames.SLIDES_TO_SHOW]: slidesToShow,
  [pluginNames.CLICK_TO_CHANGE]: clickToChange,
  [pluginNames.INFINITE]: infinite,
  [pluginNames.RTL]: rtl,
  [pluginNames.AUTOPLAY]: autoplay,
  [pluginNames.CENTERED]: centered,
  [pluginNames.SLIDES_TO_SCROLL]: slidesToScroll,
  [pluginNames.ARROWS]: arrows,
  [pluginNames.FAST_SWIPE]: fastSwipe,
};
