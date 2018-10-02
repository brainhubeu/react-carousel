var postcss  = require('postcss');
var oneColor = require('onecolor');

// SVG
var createSVG = function (filterElements) {

	var xmlns = 'http://www.w3.org/2000/svg';
	var svg  = '<svg xmlns="' + xmlns + '">';

	var svgFilter  = '<filter id="filter">';

	for(var i = 0; i < filterElements.length; i++) {
		svgFilter += filterElements[i];
	}

		svgFilter += '</filter>';

		svg += svgFilter;
		svg += '</svg>';

	return svg;

};
var createSVGElement = function (tagname, attributes, subElements) {

	var elem = '<' + tagname;
	for(var key in attributes){
		elem += ' ' + key + '="' + attributes[key] + '"';
	}
	if (subElements !== undefined) {
		elem += '>';
		for (var i = 0; i < subElements.length; i++) {
			elem += subElements[i];
		}
		elem += '</' + tagname + '>';
	} else {
		elem += ' />';
	}
	return elem;

};

// Filter object
function Filter (opts) {

	opts = opts || {};
	this.options = {
		oldIE: opts.oldIE || false
	};
	this.postcss = this.postcss.bind(this);

	this.filters = {

		// None
		none: function () {
			var properties = {};

			// CSS
			properties.filtersCSS = ['none'];

			// SVG
			properties.filtersSVG = ['none'];

			// IE
			// properties.filtersIE = ['none'];

			return properties;
		},

		// Grayscale
		grayscale: function (amount, unit) {
			amount = amount || 0;

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			var properties = {};

			// CSS
			properties.filtersCSS = ['grayscale(' + amount + ')'];

			// SVG
			var svg = createSVGElement('feColorMatrix', {
				type: 'matrix',
				'color-interpolation-filters': 'sRGB',
				values: (0.2126 + 0.7874 * (1 - amount)) + ' ' +
						(0.7152 - 0.7152 * (1 - amount)) + ' ' +
						(0.0722 - 0.0722 * (1 - amount)) + ' 0 0 ' +
						(0.2126 - 0.2126 * (1 - amount)) + ' ' +
						(0.7152 + 0.2848 * (1 - amount)) + ' ' +
						(0.0722 - 0.0722 * (1 - amount)) + ' 0 0 ' +
						(0.2126 - 0.2126 * (1 - amount)) + ' ' +
						(0.7152 - 0.7152 * (1 - amount)) + ' ' +
						(0.0722 + 0.9278 * (1 - amount)) + ' 0 0 0 0 0 1 0'
			});
			properties.filtersSVG = [svg];

			// IE
			properties.filtersIE = amount >= 0.5 ? ['gray'] : [];

			return properties;
		},

		// Sepia
		sepia: function (amount, unit) {
			amount = amount || 0;

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			var properties = {};

			// CSS
			properties.filtersCSS = ['sepia(' + amount + ')'];

			// SVG
			var svg = createSVGElement('feColorMatrix', {
				type: 'matrix',
				'color-interpolation-filters': 'sRGB',
				values: (0.393 + 0.607 * (1 - amount)) + ' ' +
						(0.769 - 0.769 * (1 - amount)) + ' ' +
						(0.189 - 0.189 * (1 - amount)) + ' 0 0 ' +
						(0.349 - 0.349 * (1 - amount)) + ' ' +
						(0.686 + 0.314 * (1 - amount)) + ' ' +
						(0.168 - 0.168 * (1 - amount)) + ' 0 0 ' +
						(0.272 - 0.272 * (1 - amount)) + ' ' +
						(0.534 - 0.534 * (1 - amount)) + ' ' +
						(0.131 + 0.869 * (1 - amount)) + ' 0 0 0 0 0 1 0'
			});
			properties.filtersSVG = [svg];

			// IE
			properties.filtersIE = amount >= 0.5 ? ['gray','progid:DXImageTransform.Microsoft.Light()'] : [];

			return properties;
		},

		// Saturate
		saturate: function (amount, unit) {
			amount = amount || 1;

			var properties = {};

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			// CSS
			properties.filtersCSS = ['saturate(' + amount + ')'];

			// SVG
			var svg = createSVGElement('feColorMatrix', {
				type: 'matrix',
				'color-interpolation-filters': 'sRGB',
				values: (0.213 + 0.787 * (amount)) + ' ' +
						(0.715 - 0.715 * (amount)) + ' ' +
						(0.072 - 0.072 * (amount)) + ' 0 0 ' +
						(0.213 - 0.213 * (amount)) + ' ' +
						(0.715 + 0.295 * (amount)) + ' '+
						(0.072 - 0.072 * (amount)) + ' 0 0 '+
						(0.213 - 0.213 * (amount)) + ' ' +
						(0.715 - 0.715 * (amount)) + ' ' +
						(0.072 + 0.928 * (amount)) + ' 0 0 0 0 0 1 0'
			});
			properties.filtersSVG = [svg];

			// IE
			// no filter

			return properties;
		},

		// Hue-rotate
		hueRotate: function (angle, unit) {
			angle = angle || 0;

			angle = helpers.angle(angle, unit);

			var properties = {};

			// CSS
			properties.filtersCSS = ['hue-rotate(' + angle + 'deg)'];

			// SVG
			var svg = createSVGElement('feColorMatrix', {
				type: 'hueRotate',
				'color-interpolation-filters': 'sRGB',
				values: angle
			});
			properties.filtersSVG = [svg];

			// IE
			// no filter

			return properties;
		},

		// Invert
		invert: function (amount, unit) {
			amount = amount || 0;

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			var properties = {};

			// CSS
			properties.filtersCSS = ['invert(' + amount + ')'];

			// SVG
			var svgSub1 = createSVGElement('feFuncR', {
				type: 'table',
				tableValues: amount + ' ' + (1 - amount)
			});
			var svgSub2 = createSVGElement('feFuncG', {
				type: 'table',
				tableValues: amount + ' ' + (1 - amount)
			});
			var svgSub3 = createSVGElement('feFuncB', {
				type: 'table',
				tableValues: amount + ' ' + (1 - amount)
			});
			var svg = createSVGElement('feComponentTransfer', {
				'color-interpolation-filters': 'sRGB'
			}, [svgSub1, svgSub2, svgSub3]);
			properties.filtersSVG = [svg];

			// IE
			properties.filtersIE = amount >= 0.5 ? ['invert'] : [];

			return properties;
		},

		// Opacity
		opacity: function (amount, unit) {
			amount = amount || 1;

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			var properties = {};

			// CSS
			properties.filtersCSS = ['opacity(' + amount + ')'];

			// SVG
			var svgSub1 = createSVGElement('feFuncA', {
				type: 'table',
				tableValues: '0 ' + amount
			});
			var svg = createSVGElement('feComponentTransfer', {
				'color-interpolation-filters': 'sRGB'
			}, [svgSub1]);
			properties.filtersSVG = [svg];

			// IE
			// no filter

			return properties;
		},

		// Brightness
		brightness: function (amount, unit) {
			amount = amount || 1;

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			var properties = {};

			// CSS
			properties.filtersCSS = ['brightness(' + amount + ')'];

			// SVG
			var svgSub1 = createSVGElement('feFuncR', {
				type: 'linear',
				slope: amount
			});
			var svgSub2 = createSVGElement('feFuncG', {
				type: 'linear',
				slope: amount
			});
			var svgSub3 = createSVGElement('feFuncB', {
				type: 'linear',
				slope: amount
			});
			var svg = createSVGElement('feComponentTransfer', {
				'color-interpolation-filters': 'sRGB'
			}, [svgSub1, svgSub2, svgSub3]);
			properties.filtersSVG = [svg];

			// IE
			properties.filtersIE = ['progid:DXImageTransform.Microsoft.Light()'];

			return properties;
		},

		// Contrast
		contrast: function (amount, unit) {
			amount = amount || 1;

			if (typeof unit !== 'undefined') {
				amount /= 100;
			}

			var properties = {};

			// CSS
			properties.filtersCSS = ['contrast(' + amount + ')'];

			// SVG
			var svgSub1 = createSVGElement('feFuncR', {
				type: 'linear',
				slope: amount,
				intercept: -(0.5 * amount) + 0.5
			});
			var svgSub2 = createSVGElement('feFuncG', {
				type: 'linear',
				slope: amount,
				intercept: -(0.5 * amount) + 0.5
			});
			var svgSub3 = createSVGElement('feFuncB', {
				type: 'linear',
				slope: amount,
				intercept: -(0.5 * amount) + 0.5
			});
			var svg = createSVGElement('feComponentTransfer', {
				'color-interpolation-filters': 'sRGB'
			}, [svgSub1, svgSub2, svgSub3]);
			properties.filtersSVG = [svg];

			// IE
			// no filter

			return properties;
		},

		// Blur
		blur: function (amount, unit) {
			amount = amount || 0;

			var properties = {};

			if (unit === '' && amount !== 0) {
				return properties;
			}

			amount = helpers.length(amount, unit);

			// CSS
			properties.filtersCSS = ['blur(' + amount + 'px)'];

			// SVG
			var svg = createSVGElement('feGaussianBlur', {
				stdDeviation: amount
			});
			properties.filtersSVG = [svg];

			// IE
			properties.filtersIE = ['progid:DXImageTransform.Microsoft.Blur(pixelradius=' + amount + ')'];

			return properties;
		},

		// Drop Shadow
		dropShadow: function (offsetX, unitX, offsetY, unitY, radius, unitRadius, spread, unitSpread, color) {
			offsetX = Math.round(offsetX) || 0;
			offsetY = Math.round(offsetY) || 0;
			radius = Math.round(radius) || 0;
			color = color || '#000000';

			var properties = {};

			if ((unitX === ' ' && offsetX !== 0) || (unitY === ' ' && offsetY !== 0) || (unitRadius === ' ' && radius !== 0) || spread) {
				return properties;
			}

			offsetX = helpers.length(offsetX, unitX);
			offsetY = helpers.length(offsetY, unitY);
			radius  = helpers.length(radius, unitRadius);

			// CSS
			properties.filtersCSS = ['drop-shadow(' + offsetX + 'px ' + offsetY + 'px ' + radius + 'px ' + color + ')'];

			// SVG
			var svg1 = createSVGElement('feGaussianBlur', {
				'in': 'SourceAlpha',
				stdDeviation: radius
			});
			var svg2 = createSVGElement('feOffset', {
				dx: offsetX + 1,
				dy: offsetY + 1,
				result: 'offsetblur'
			});
			var svg3 = createSVGElement('feFlood', {
				'flood-color': oneColor(color).cssa()
			});
			var svg4 = createSVGElement('feComposite', {
				in2: 'offsetblur',
				operator: 'in'
			});
			var svg5Sub1 = createSVGElement('feMergeNode', {});
			var svg5Sub2 = createSVGElement('feMergeNode', {
				'in': 'SourceGraphic'
			});
			var svg5 = createSVGElement('feMerge', {}, [svg5Sub1, svg5Sub2]);
			properties.filtersSVG = [svg1,svg2,svg3,svg4,svg5];

			// IE
			properties.filtersIE = ['progid:DXImageTransform.Microsoft.Glow(color=' + color + ',strength=0)','progid:DXImageTransform.Microsoft.Shadow(color=' + color + ',strength=0)'];

			return properties;
		}
	};

	var helpers = {

		length: function (amount, unit) {
			switch (unit) {
				case 'px':
					break;
				case 'em':
				case 'rem':
					amount *= 16;
					break;
			}
			return amount;
		},

		angle: function (amount, unit) {
			switch (unit) {
				case 'deg':
					break;
				case 'grad':
					amount = 180 * amount / 200;
					break;
				case 'rad':
					amount = 180 * amount / Math.PI;
					break;
				case 'turn':
					amount = 360 * amount;
					break;
			}
			return amount;
		}

	};

}

Filter.prototype.convert = function (value) {

	var fmatch,
		amount,
		unit,
		properties;

	// None
	fmatch = value.match(/none/i);
	if(fmatch !== null){
		properties = this.filters.none();
	}
	// Grayscale
	fmatch = value.match(/(grayscale)\(\s*([0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.grayscale(amount, unit);
	}
	// Sepia
	fmatch = value.match(/(sepia)\(\s*([0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.sepia(amount, unit);
	}
	// Saturate
	fmatch = value.match(/(saturate)\(\s*([0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.saturate(amount, unit);
	}
	// Hue-rotate
	fmatch = value.match(/(hue\-rotate)\((\s*[0-9\.]+)(deg|grad|rad|turn)\s*\)/i);
	if (fmatch !== null) {
		var angle = parseFloat(fmatch[2], 10);
			unit = fmatch[3];
			properties = this.filters.hueRotate(angle, unit);
	}
	// Invert
	fmatch = value.match(/(invert)\((\s*[0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.invert(amount, unit);
	}
	// Opacity
	fmatch = value.match(/(opacity)\((\s*[0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.opacity(amount, unit);
	}
	// Brightness
	fmatch = value.match(/(brightness)\((\s*[0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.brightness(amount, unit);
	}
	// Contrast
	fmatch = value.match(/(contrast)\((\s*[0-9\.]+)(%)*\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.contrast(amount, unit);
	}
	// Blur
	fmatch = value.match(/(blur)\((\s*[0-9\.]+)(px|em|rem|)\s*\)/i);
	if (fmatch !== null) {
		amount = parseFloat(fmatch[2], 10);
		unit   = fmatch[3];
		properties = this.filters.blur(amount, unit);
	}
	// Drop Shadow
	fmatch = value.match(/(drop\-shadow)\((\s*[0-9\.]+)(px|em|rem| )\s*([0-9\.]+)(px|em|rem| )\s*([0-9\.]+)(px|em|rem| )(\s*([0-9\.]+)(px|em|rem| ))?\s*([a-z0-9\#\%\,\.\s\(\)]*)(?=\s*\))/i);
	if (fmatch !== null) {
		var offsetX    = parseFloat(fmatch[2], 10),
			unitX      = fmatch[3],
			offsetY    = parseFloat(fmatch[4], 10),
			unitY      = fmatch[5],
			radius     = parseFloat(fmatch[6], 10),
			unitRadius = fmatch[7],
			spread     = parseFloat(fmatch[9], 10),
			unitSpread = fmatch[10],
			color      = fmatch[11].trim();
			properties = this.filters.dropShadow(offsetX, unitX, offsetY, unitY, radius, unitRadius, spread, unitSpread, color);
	}

	return properties;

};

Filter.prototype.postcss = function (css) {

	var _this = this;

	css.walkRules(function (rule) {

		rule.walkDecls(function (decl, idx) {

			// find filter declaration
			if (decl.prop === 'filter') {

				// get values
				var values = decl.value.split(/\)\s+(?!\))/);
				var properties = {
					filtersCSS: [],
					filtersSVG: [],
					filtersIE:  []
				};

				for (var i = 0; i < values.length; i++) {
					var value = values[i];
					// when splitting values, re-add closing parenthesis
					if (i != values.length - 1) {
						value += ')';
					}
					var currentProperties = _this.convert(value);
					for (var j in currentProperties){
						if (typeof properties[j] !== 'undefined') {
							properties[j] = properties[j].concat(currentProperties[j]);
						}
					}
				}

				if (properties.filtersCSS.length > 0) {
					var filtersCSS = properties.filtersCSS.join(' ');

					// set new value?
					// decl.value = filtersCSS;
				}

				if (_this.options.oldIE && properties.filtersIE.length > 0) {
					var filtersIE = properties.filtersIE.join(' ');

					// insert IE filters, only if it's not already present
					var newDecl = { prop: 'filter', value: filtersIE};
					var add = true;
					rule.walkDecls(function (d) {
						if (newDecl.value === d.value) {
							add = false;
							return false;
						}
					});
					if (add) {
						rule.insertAfter(decl, newDecl);
					}
				}

				if (properties.filtersSVG.length > 0) {
					var none = false;
					for (var i = 0; i < properties.filtersSVG.length; i++) {
						if (properties.filtersSVG[i] === 'none') {
							none = true;
							break;
						}
					}
					if (!none) {
						var svgString = createSVG(properties.filtersSVG);
						var filtersSVG = 'url(\'data:image/svg+xml;charset=utf-8,' + svgString + '#filter\')';

						// insert SVG filters, only if it's not already present
						var newDecl = { prop: 'filter', value: filtersSVG};
						var add = true;
						rule.walkDecls(function (d) {
							if (newDecl.value === d.value) {
								add = false;
								return false;
							}
						});
						if (add) {
							rule.insertBefore(decl, newDecl);
						}
					}
				}

			}

		});

	});

};

Filter.prototype.process = function (css) {
	return postcss().use(this.postcss).process(css).css;
};

module.exports = postcss.plugin('pleeease-filters', function(options) {
	return new Filter(options).postcss;
});
