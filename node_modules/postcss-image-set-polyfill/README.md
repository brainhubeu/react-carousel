
# postcss-image-set-polyfill [![Build Status](https://travis-ci.org/SuperOl3g/postcss-image-set-polyfill.svg)](https://travis-ci.org/SuperOl3g/postcss-image-set-polyfill) [![npm version](https://badge.fury.io/js/postcss-image-set-polyfill.svg)](https://badge.fury.io/js/postcss-image-set-polyfill)

[PostCSS] plugin for [polyfilling](http://caniuse.com/#feat=css-image-set) [`image-set`](https://drafts.csswg.org/css-images-3/#image-set-notation) CSS function.

[PostCSS]: https://github.com/postcss/postcss

```css
/* Input example */
.foo {
    background-image: image-set(url(img/test.png) 1x,
                                url(img/test-2x.png) 2x,
                                url(my-img-print.png) 600dpi);
}
```

```css
/* Output example */
.foo {
    background-image: url(img/test.png);
}

@media (min-resolution: 144dpi) {
    .foo {
        background-image: url(img/test-2x.png);
    }
}

@media (min-resolution: 600dpi) {
    .foo {
        background-image: url(my-img-print.png);
    }
}
```
[→Try it online←](https://astexplorer.net/#/gist/86d1248cc4628f850454d3191c95efec/de5684b73276bf42df443e448b821d38f05414c4)


❗️ Resolution media query is supported only by IE9+.

## Installation

`npm i postcss-image-set-polyfill -D`

## Usage

```js
var postcssImageSet = require('postcss-image-set-polyfill');

postcss([postcssImageSet]).process(YOUR_CSS, /* options */);
```

See [PostCSS] docs for examples for your environment.


### ⚠️️ Warning

If you use [autoprefixer](https://github.com/postcss/autoprefixer), place this plugin before it to prevent styles duplication.

