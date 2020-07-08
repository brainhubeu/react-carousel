import flatten from 'lodash/flatten';

import { plugins as pluginsFunc } from '../constants/plugins';
import pluginsOrder from '../constants/pluginsOrder';

const carouselPluginResolver = (
  plugins,
  carouselProps,
  trackRef,
  trackContainerRef,
  nodeRef,
) => {
  const carouselPlugins = carouselProps?.plugins.map((plugin) => {
    if (typeof plugin === 'string') {
      return (
        pluginsFunc[plugin.toUpperCase()] &&
        pluginsFunc[plugin.toUpperCase()]({
          pluginProps: {
            ...carouselProps,
            children: carouselProps.children
              ? carouselProps.children
              : carouselProps.slides,
          },
          options: plugin.options,
          refs: { trackRef },
        })
      );
    }
    return plugin.resolve({
      pluginProps: carouselProps,
      options: plugin.options,
      refs: { trackRef, trackContainerRef, nodeRef },
    });
  });
  const itemClassNames = flatten(
    carouselPlugins.map(
      (plugin) =>
        plugin.itemClassNames &&
        plugin.itemClassNames({
          carouselProps,
          options: plugin.options,
          refs: { trackRef },
        }),
    ),
  ).filter((className) => typeof className === 'string');

  const carouselClassNames = flatten(
    carouselPlugins.map(
      (plugin) =>
        plugin.carouselClassNames &&
        plugin.carouselClassNames({
          carouselProps,
          options: plugin.options,
          refs: { trackRef },
        }),
    ),
  ).filter((className) => typeof className === 'string');

  const customProps = carouselPlugins.map(
    (plugin) => plugin.carouselProps && plugin.carouselProps(),
  );

  const beforeCarouselItems =
    carouselPlugins.map(
      (plugin) => plugin.beforeCarouselItems && plugin.beforeCarouselItems(),
    ) || [];

  const afterCarouselItems =
    carouselPlugins.map(
      (plugin) => plugin.afterCarouselItems && plugin.afterCarouselItems(),
    ) || [];

  const merged = Object.assign({}, ...customProps);

  const strategies = carouselPlugins
    .sort((a, b) => pluginsOrder.indexOf(a.name) - pluginsOrder.indexOf(b.name))
    .map((plugin) => plugin.strategies && plugin.strategies());

  return {
    itemClassNames,
    carouselClassNames,
    beforeCarouselItems,
    afterCarouselItems,
    strategies,
    merged,
    carouselPlugins,
  };
};

export default carouselPluginResolver;
