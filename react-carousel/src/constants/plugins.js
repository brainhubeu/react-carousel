import pluginsFunc from '../plugins';

const {
  slidesPerPage,
  infinite,
  clickToChange,
  autoplay,
  rtl,
  centered,
  slidesPerScroll,
  arrows,
  keepDirectionWhenDragging,
} = pluginsFunc;

export const pluginNames = {
  SLIDES_PER_PAGE: 'SLIDESPERPAGE',
  CLICK_TO_CHANGE: 'CLICKTOCHANGE',
  INFINITE: 'INFINITE',
  AUTOPLAY: 'AUTOPLAY',
  RTL: 'RTL',
  CENTERED: 'CENTERED',
  SLIDES_PER_SCROLL: 'SLIDESPERSCROLL',
  ARROWS: 'ARROWS',
  KEEP_DIRECTION_WHEN_DRAGGING: 'KEEPDIRECTIONWHENDRAGGING',
};

export const plugins = {
  [pluginNames.SLIDES_PER_PAGE]: slidesPerPage,
  [pluginNames.CLICK_TO_CHANGE]: clickToChange,
  [pluginNames.INFINITE]: infinite,
  [pluginNames.RTL]: rtl,
  [pluginNames.AUTOPLAY]: autoplay,
  [pluginNames.CENTERED]: centered,
  [pluginNames.SLIDES_PER_SCROLL]: slidesPerScroll,
  [pluginNames.ARROWS]: arrows,
  [pluginNames.KEEP_DIRECTION_WHEN_DRAGGING]: keepDirectionWhenDragging,
};
