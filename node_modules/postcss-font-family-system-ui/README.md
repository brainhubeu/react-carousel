# postcss-font-family-system-ui

[![npm version](https://img.shields.io/npm/v/postcss-font-family-system-ui.svg?style=flat-square)](https://www.npmjs.com/package/postcss-font-family-system-ui)
[![Build Status](https://img.shields.io/travis/JLHwung/postcss-font-family-system-ui.svg?style=flat-square)](https://travis-ci.org/JLHwung/postcss-font-family-system-ui)
[![Coverage Status](https://img.shields.io/coveralls/JLHwung/postcss-font-family-system-ui.svg?style=flat-square)](https://coveralls.io/github/JLHwung/postcss-font-family-system-ui)
[![Greenkeeper badge](https://badges.greenkeeper.io/JLHwung/postcss-font-family-system-ui.svg)](https://greenkeeper.io/)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform W3C CSS generic font-family [system-ui](https://drafts.csswg.org/css-fonts-4/#valdef-font-family-system-ui) to a practical font-family list

## Installation
```bash
yarn add postcss-font-family-system-ui
```

## Usage
```js
// dependencies
import postcss from 'postcss'
import fontFamilySystemUI from 'postcss-font-family-system-ui'

// css to be processed
const css = fs.readFileSync("input.css", "utf8")

// process css using postcss-font-family-system-ui
const out = postcss()
  .use(fontFamilySystemUI())
  .process(css)
  .css
```

Using this `input.css`:

```css
body {
  font-family: system-ui;
}

```

you will get:

```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;
}
```

Checkout [tests](test) for examples.

## FAQ

### Can I use `require('postcss-font-family-system-ui')`?
Yes
