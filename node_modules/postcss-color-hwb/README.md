# postcss-color-hwb [![Build Status](https://travis-ci.org/postcss/postcss-color-hwb.png)](https://travis-ci.org/postcss/postcss-color-hwb)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS hwb() color](http://dev.w3.org/csswg/css-color/#the-hwb-notation) to more compatible CSS (rgb() (or rgba())).

## Installation

```bash
$ npm install postcss-color-hwb
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorHwb = require("postcss-color-hwb")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(colorHwb())
  .process(css)
  .css
```

Using this `input.css`:

```css
body {
  color: hwb(90, 0%, 0%, 0.5);
}

```

you will get:

```css
body {
  color: rgba(128, 255, 0, 0.5);
}
```

Checkout [tests](test) for more examples.

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

    $ git clone https://github.com/postcss/postcss-color-hwb.git
    $ git checkout -b patch-1
    $ npm install
    $ npm test

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
