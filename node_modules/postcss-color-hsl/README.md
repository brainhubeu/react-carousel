# PostCSS Color Hsl [![Build Status][ci-img]][ci] [![Coverage Status][cov-img]][cov]

[PostCSS] plugin to transform [W3C CSS Color Module Level 4 hsl()](https://drafts.csswg.org/css-color/#the-hsl-notation) new syntax to more compatible CSS (comma-separated hsl() or hsla()).

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/dmarchena/postcss-color-hsl.svg
[ci]:      https://travis-ci.org/dmarchena/postcss-color-hsl
[cov-img]: https://coveralls.io/repos/github/dmarchena/postcss-color-hsl/badge.svg
[cov]:     https://coveralls.io/github/dmarchena/postcss-color-hsl

## CSS Colors 4 syntax

```
hsl() = hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? )
<hue> = <number> | <angle>
<alpha-value> = <number> | <percentage>
```

## CSS Colors 3 syntax (actual)

```
hsl()  = hsl( <hue>, <percentage>, <percentage> )
hsla() = hsla( <hue>, <percentage>, <percentage>, <alpha-value> )
<hue> = <number>
<alpha-value> = <number>
```

## Example

```css
.foo {
  /* Input example */
  color: hsl(0 100% 50%);
  border-color: hsl(200grad 100% 50% / 20%);
}
```

```css
.foo {
  /* Output example */
  color: hsl(0, 100%, 50%);
  border-color: hsla(180, 100%, 50%, .2);
}
```

## Usage

```js
postcss([ require('postcss-color-hsl') ])
```

See [PostCSS] docs for examples for your environment.
