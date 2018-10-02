# PostCSS Color Rgb [![Build Status][ci-img]][ci] [![Coverage Status][cov-img]][cov]

[PostCSS] plugin to transform [W3C CSS Color Module Level 4 rgb()](https://drafts.csswg.org/css-color/#funcdef-rgb) new syntax to more compatible CSS (comma-separated rgb() or rgba()).

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/dmarchena/postcss-color-rgb.svg
[ci]:      https://travis-ci.org/dmarchena/postcss-color-rgb
[cov-img]: https://coveralls.io/repos/github/dmarchena/postcss-color-rgb/badge.svg
[cov]:     https://coveralls.io/github/dmarchena/postcss-color-rgb

## CSS Colors 4 syntax

```
rgb() = rgb( <percentage>{3} [ / <alpha-value> ]? ) |
        rgb( <number>{3} [ / <alpha-value> ]? )

<alpha-value> = <number> | <percentage>
```

## CSS Colors 3 syntax (actual)

```
rgb() = rgb( <percentage>#{3}) |
        rgb( <integer>#{3})

rgba() = rgba( <percentage>#{3} , <alpha-value> ) |
         rgba( <integer>#{3} , <alpha-value> )

<alpha-value> = <number>
```

## Example

```css
.foo {
  /* Input example */
  color: rgb(250.5 255 255);
  background-image: linear-gradient(to bottom right, rgb(10% 11% 12% / 90%), rgb(23% 24% 25% / .5));
}
```

```css
.foo {
  /* Output example */
  color: rgb(251, 255, 255);
  background-image: linear-gradient(to bottom right, rgba(10%, 11%, 12%, .9), rgba(23%, 24%, 25%, .5));
}
```

## Usage

```js
postcss([ require('postcss-color-rgb') ])
```

See [PostCSS] docs for examples for your environment.
