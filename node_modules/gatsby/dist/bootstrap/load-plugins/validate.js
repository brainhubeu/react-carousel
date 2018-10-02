"use strict";

var _ = require(`lodash`);

var reporter = require(`gatsby-cli/lib/reporter`);
var resolveModuleExports = require(`../resolve-module-exports`);

// Given a plugin object, an array of the API names it exports and an
// array of valid API names, return an array of invalid API exports.
var getBadExports = function getBadExports(plugin, pluginAPIKeys, apis) {
  var badExports = [];
  // Discover any exports from plugins which are not "known"
  badExports = badExports.concat(_.difference(pluginAPIKeys, apis).map(function (e) {
    return {
      exportName: e,
      pluginName: plugin.name,
      pluginVersion: plugin.version
    };
  }));
  return badExports;
};

var getBadExportsMessage = function getBadExportsMessage(badExports, exportType, apis) {
  var _require = require(`common-tags`),
      stripIndent = _require.stripIndent;

  var stringSimiliarity = require(`string-similarity`);
  var capitalized = `${exportType[0].toUpperCase()}${exportType.slice(1)}`;
  if (capitalized === `Ssr`) capitalized = `SSR`;

  var message = `\n`;
  message += stripIndent`
    Your plugins must export known APIs from their gatsby-${exportType}.js.
    The following exports aren't APIs. Perhaps you made a typo or
    your plugin is outdated?

    See https://www.gatsbyjs.org/docs/${exportType}-apis/ for the list of Gatsby ${capitalized} APIs`;

  badExports.forEach(function (bady) {
    var similarities = stringSimiliarity.findBestMatch(bady.exportName, apis);
    message += `\n — `;
    if (bady.pluginName == `default-site-plugin`) {
      message += `Your site's gatsby-${exportType}.js is exporting a variable named "${bady.exportName}" which isn't an API.`;
    } else {
      message += `The plugin "${bady.pluginName}@${bady.pluginVersion}" is exporting a variable named "${bady.exportName}" which isn't an API.`;
    }
    if (similarities.bestMatch.rating > 0.5) {
      message += ` Perhaps you meant to export "${similarities.bestMatch.target}"?`;
    }
  });

  return message;
};

var handleBadExports = function handleBadExports(_ref) {
  var apis = _ref.apis,
      badExports = _ref.badExports;

  // Output error messages for all bad exports
  var isBad = false;
  _.toPairs(badExports).forEach(function (badItem) {
    var exportType = badItem[0],
        entries = badItem[1];

    if (entries.length > 0) {
      isBad = true;
      console.log(getBadExportsMessage(entries, exportType, apis[exportType]));
    }
  });
  return isBad;
};

/**
 * Identify which APIs each plugin exports
 */
var collatePluginAPIs = function collatePluginAPIs(_ref2) {
  var apis = _ref2.apis,
      flattenedPlugins = _ref2.flattenedPlugins;

  var allAPIs = [].concat(apis.node, apis.browser, apis.ssr);
  var apiToPlugins = allAPIs.reduce(function (acc, value) {
    acc[value] = [];
    return acc;
  }, {});

  // Get a list of bad exports
  var badExports = {
    node: [],
    browser: [],
    ssr: []
  };

  flattenedPlugins.forEach(function (plugin) {
    plugin.nodeAPIs = [];
    plugin.browserAPIs = [];
    plugin.ssrAPIs = [];

    // Discover which APIs this plugin implements and store an array against
    // the plugin node itself *and* in an API to plugins map for faster lookups
    // later.
    var pluginNodeExports = resolveModuleExports(`${plugin.resolve}/gatsby-node`);
    var pluginBrowserExports = resolveModuleExports(`${plugin.resolve}/gatsby-browser`);
    var pluginSSRExports = resolveModuleExports(`${plugin.resolve}/gatsby-ssr`);

    if (pluginNodeExports.length > 0) {
      plugin.nodeAPIs = _.intersection(pluginNodeExports, apis.node);
      plugin.nodeAPIs.map(function (nodeAPI) {
        return apiToPlugins[nodeAPI].push(plugin.name);
      });
      badExports.node = getBadExports(plugin, pluginNodeExports, apis.node); // Collate any bad exports
    }

    if (pluginBrowserExports.length > 0) {
      plugin.browserAPIs = _.intersection(pluginBrowserExports, apis.browser);
      plugin.browserAPIs.map(function (browserAPI) {
        return apiToPlugins[browserAPI].push(plugin.name);
      });
      badExports.browser = getBadExports(plugin, pluginBrowserExports, apis.browser); // Collate any bad exports
    }

    if (pluginSSRExports.length > 0) {
      plugin.ssrAPIs = _.intersection(pluginSSRExports, apis.ssr);
      plugin.ssrAPIs.map(function (ssrAPI) {
        return apiToPlugins[ssrAPI].push(plugin.name);
      });
      badExports.ssr = getBadExports(plugin, pluginSSRExports, apis.ssr); // Collate any bad exports
    }
  });

  return { apiToPlugins, flattenedPlugins, badExports };
};

var handleMultipleReplaceRenderers = function handleMultipleReplaceRenderers(_ref3) {
  var apiToPlugins = _ref3.apiToPlugins,
      flattenedPlugins = _ref3.flattenedPlugins;

  // multiple replaceRenderers may cause problems at build time
  if (apiToPlugins.replaceRenderer.length > 1) {
    var rendererPlugins = [].concat(apiToPlugins.replaceRenderer);

    if (rendererPlugins.includes(`default-site-plugin`)) {
      reporter.warn(`replaceRenderer API found in these plugins:`);
      reporter.warn(rendererPlugins.join(`, `));
      reporter.warn(`This might be an error, see: https://www.gatsbyjs.org/docs/debugging-replace-renderer-api/`);
    } else {
      console.log(``);
      reporter.error(`Gatsby's replaceRenderer API is implemented by multiple plugins:`);
      reporter.error(rendererPlugins.join(`, `));
      reporter.error(`This will break your build`);
      reporter.error(`See: https://www.gatsbyjs.org/docs/debugging-replace-renderer-api/`);
      if (process.env.NODE_ENV === `production`) process.exit(1);
    }

    // Now update plugin list so only final replaceRenderer will run
    var ignorable = rendererPlugins.slice(0, -1);

    // For each plugin in ignorable, set a skipSSR flag to true
    // This prevents apiRunnerSSR() from attempting to run it later
    var messages = [];
    flattenedPlugins.forEach(function (fp, i) {
      if (ignorable.includes(fp.name)) {
        messages.push(`Duplicate replaceRenderer found, skipping gatsby-ssr.js for plugin: ${fp.name}`);
        flattenedPlugins[i].skipSSR = true;
      }
    });
    if (messages.length > 0) {
      console.log(``);
      messages.forEach(function (m) {
        return reporter.warn(m);
      });
      console.log(``);
    }
  }

  return flattenedPlugins;
};

module.exports = {
  collatePluginAPIs,
  handleBadExports,
  handleMultipleReplaceRenderers
};
//# sourceMappingURL=validate.js.map