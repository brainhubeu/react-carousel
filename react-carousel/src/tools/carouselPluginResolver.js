import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';

import { plugins as pluginsFunc } from '../constants/plugins';
import pluginsOrder from '../constants/pluginsOrder';

const carouselPluginResolver = (
  plugins,
  carouselProps,
  trackContainerRef,
  carouselRef,
) => {
  const carouselPlugins = carouselProps?.plugins.map((plugin) => {
    if (typeof plugin === 'string') {
      return (
        pluginsFunc[plugin.toUpperCase()] &&
        pluginsFunc[plugin.toUpperCase()]({
          carouselProps: {
            ...carouselProps,
            children: carouselProps.children
              ? carouselProps.children
              : carouselProps.slides,
          },
          options: plugin.options,
          refs: { trackContainerRef, carouselRef },
        })
      );
    }
    return plugin.resolve({
      carouselProps,
      options: plugin.options,
      refs: { trackContainerRef, carouselRef },
    });
  });
  const itemClassNames = _flatten(
    carouselPlugins.map(
      (plugin) =>
        plugin.itemClassNames &&
        plugin.itemClassNames({
          carouselProps,
          options: plugin.options,
          refs: { trackContainerRef, carouselRef },
        }),
    ),
  ).filter((className) => typeof className === 'string');

  const carouselClassNames = _flatten(
    carouselPlugins.map(
      (plugin) =>
        plugin.carouselClassNames &&
        plugin.carouselClassNames({
          carouselProps,
          options: plugin.options,
          refs: { trackContainerRef, carouselRef },
        }),
    ),
  ).filter((className) => typeof className === 'string');

  const carouselCustomProps = Object.assign(
    {},
    ...carouselPlugins.map(
      (plugin) => plugin.carouselCustomProps && plugin.carouselCustomProps(),
    ),
  );

  const trackCustomProps = Object.assign(
    {},
    ...carouselPlugins.map(
      (plugin) => plugin.trackCustomProps && plugin.trackCustomProps(),
    ),
  );

  const slideCustomProps = Object.assign(
    {},
    ...carouselPlugins.map(
      (plugin) => plugin.slideCustomProps && plugin.slideCustomProps(),
    ),
  );

  const beforeCarouselItems =
    carouselPlugins.map(
      (plugin) => plugin.beforeCarouselItems && plugin.beforeCarouselItems(),
    ) || [];

  const afterCarouselItems =
    carouselPlugins.map(
      (plugin) => plugin.afterCarouselItems && plugin.afterCarouselItems(),
    ) || [];

  const strategies = _sortBy(carouselPlugins, (plugin) =>
    pluginsOrder.indexOf(plugin.name),
  ).map((plugin) => plugin.strategies && plugin.strategies());

  return {
    itemClassNames,
    carouselClassNames,
    beforeCarouselItems,
    afterCarouselItems,
    strategies,
    carouselCustomProps,
    trackCustomProps,
    slideCustomProps,
    carouselPlugins,
  };
};

export default carouselPluginResolver;
