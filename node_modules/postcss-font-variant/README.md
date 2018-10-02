# postcss-font-variant [![Build Status](https://travis-ci.org/postcss/postcss-font-variant.png)](https://travis-ci.org/postcss/postcss-font-variant)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS font variant](http://dev.w3.org/csswg/css-fonts/#propdef-font-variant) properties to more compatible CSS (font-feature-settings).

## Installation

```console
$ npm install postcss-font-variant
```

## Usage

```js
// dependencies
var postcss = require("postcss")
var fontVariant = require("postcss-font-variant")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css using postcss-font-variant
var out = postcss()
  .use(fontVariant())
  .process(css)
  .css
```

Using this `input.css`:

```css
h2 {
  font-variant-caps: small-caps;
}

table {
  font-variant-numeric: lining-nums;
}
```

you will get:

```css
h2 {
  font-feature-settings: "c2sc";
  font-variant-caps: small-caps;
}

table {
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
}

```

Checkout [tests](test) for more examples.

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

    $ git clone https://github.com/postcss/postcss-font-variant.git
    $ git checkout -b patch-1
    $ npm install
    $ npm test

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
