var postcss = require('postcss');
var postcssSelectorParser = require('postcss-selector-parser');

module.exports = postcss.plugin('postcss-pseudo-class-any-link', function (opts) {
	// cache the any-link value
	var valueAnyLink = ':' + (opts && opts.prefix ? '-' + opts.prefix + '-' : '') + 'any-link';

	return function (css) {
		// for each rule
		css.walkRules(function (rule) {
			// update the selector
			rule.selector = postcssSelectorParser(function (selectors) {
				// cache variables
				var node;
				var nodeIndex;
				var selector;
				var selectorLink;
				var selectorVisited;

				// cache the selector index
				var selectorIndex = -1;

				// for each selector
				while (selector = selectors.nodes[++selectorIndex]) {
					// reset the node index
					nodeIndex = -1;

					// for each node
					while (node = selector.nodes[++nodeIndex]) {
						// if the node value matches the any-link value
						if (node.value === valueAnyLink) {
							// clone the selector
							selectorLink = selector.clone();
							selectorVisited = selector.clone();

							// update the matching clone values
							selectorLink.nodes[nodeIndex].value = ':link';
							selectorVisited.nodes[nodeIndex].value = ':visited';

							// replace the selector with the clones and roll back the selector index
							selectors.nodes.splice(selectorIndex--, 1, selectorLink, selectorVisited);

							// stop updating the selector
							break;
						}
					}
				}
			}).process(rule.selector).result;
		});
	};
});
