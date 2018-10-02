Pleeease: filters
=================

Convert CSS shorthand filters to SVG equivalent.

Used by [Pleeease](https://github.com/iamvdo/pleeease), a CSS post-processor.

Try it by yourself in the [Pleeease playground](http://pleeease.io/playground.html?div%20%7B%0A%20%20filter:%20blur(4px)%0A%7D)

##Example

You write `foo.css`:

```css
.blur {
	filter: blur(4px);
}
```

You get `bar.css`:

```css
.blur {
	filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="4" /></filter></svg>#filter');
	filter: blur(4px);
}
```

##Filters

It converts all 10 CSS shorthand filters:

* grayscale
* sepia
* saturate
* hue-rotate
* invert
* opacity
* brightness
* contrast
* blur
* drop-shadow

Learn [more about CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)

##Prefixes

This tool doesn't add prefixes. If you want them, you should use [Autoprefixer](https://github.com/ai/autoprefixer). This is what [Pleeease](https://github.com/iamvdo/pleeease) does:

```css
.blur {
	filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="4" /></filter></svg>#filter');
	-webkit-filter: blur(4px);
	        filter: blur(4px);
}
```

##Usage

	$ npm install pleeease-filters

```javascript
var filters = require('pleeease-filters'),
	fs      = require('fs');

var css = fs.readFileSync('app.css', 'utf8');

// define options here
var options = {};

var fixed = filters.process(css, options);

fs.writeFile('app.min.css', fixed, function (err) {
  if (err) {
    throw err;
  }
  console.log('File saved!');
});
```
##Options

You can also add IE filters with an option:

```javascript
// set options
var options = {
	oldIE: true
}
```

Using the first example, you'll get:

```css
.blur {
	filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="4" /></filter></svg>#filter');
	filter: blur(4px);
	filter: progid:DXImageTransform.Microsoft.Blur(pixelradius=4);
}
```

##Note

**Be careful**, not all browsers support CSS or SVG filters on HTML content:

* latest WebKit browsers support CSS shorthand
* Firefox support SVG filters (and CSS shorthand since FF35)
* IE9- support IE filters (limited and slightly degraded)

**It means that IE10+, Opera Mini and Android browsers have no support at all on HTML, only in SVG.**

Moreover, IE filters shouldn't be used.

See [caniuse](http://caniuse.com/#feat=svg-filters) for more info.

##Licence

MIT © 2014 [Vincent De Oliveira &middot; iamvdo](https://github.com/iamvdo)

This module is an adaptation of [CSS-Filters-Polyfill](https://github.com/Schepp/CSS-Filters-Polyfill). Copyright (c) 2012 - 2013 Christian Schepp Schaefer
