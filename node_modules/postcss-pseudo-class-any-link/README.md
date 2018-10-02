# PostCSS Pseudo-Class Any-Link [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS Pseudo-Class Any-Link] is a [PostCSS] plugin that allows you to use the proposed [`:any-link`] pseudo-class in CSS.

`:any-link` simplifies selectors targeting links, as the naming of `:link` is misleading; it specifically means unvisited links only, rather than all links.

```css
/* before */

nav :any-link > span {
	background-color: yellow;
}

/* after */

nav :link > span,
nav :visited > span {
	background-color: yellow;
}
```

From the [proposal]:

> The [`:any-link`] pseudo-class represents an element that acts as the source anchor of a hyperlink. It matches an element if the element would match [`:link`] or [`:visited`].

## Usage

You just need to follow these two steps to use [PostCSS Pseudo-Class Any-Link]:

1. Add [PostCSS] to your build tool.
2. Add [PostCSS Pseudo-Class Any-Link] as a PostCSS process.

```sh
npm install postcss-pseudo-class-any-link --save-dev
```

### Node

```js
postcss([ require('postcss-pseudo-class-any-link')({ /* options */ }) ])
```

### Grunt

Add [Grunt PostCSS] to your build tool:

```sh
npm install postcss-pseudo-class-any-link --save-dev
```

Enable [PostCSS Pseudo-Class Any-Link] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('postcss-pseudo-class-any-link')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

### Options

**prefix** (string): prepends a prefix (surrounded by dashes) to the pseudo-class, preventing any clash with native syntax.

```js
{
	prefix: 'foo' // pseudo-class becomes :-foo-any-link
}
```

### Alternatives

Here are a few other ways to simulate the effect of [PostCSS Pseudo-Class Any-Link].

```css
/* Use @custom-selector; supported nowhere yet */

@custom-selector :--any-link :link, :visited;

:--any-link { /* ... */ }

/* Use :matches; supported in Firefox 4+, Chrome 12+, Opera 15+, Safari 5.1+ */

:matches(:link, :visited) { /* ... */ }

/* Use :link and :visited; supported everywhere */

:link, :visited { /* ... */ }
```

[`:any-link`]: http://dev.w3.org/csswg/selectors/#any-link-pseudo
[`:link`]: http://dev.w3.org/csswg/selectors/#link-pseudo
[`:visited`]: http://dev.w3.org/csswg/selectors/#visited-pseudo
[ci]: https://travis-ci.org/jonathantneal/postcss-pseudo-class-any-link
[ci-img]: https://travis-ci.org/jonathantneal/postcss-pseudo-class-any-link.svg
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Pseudo-Class Any-Link]: https://github.com/jonathantneal/postcss-pseudo-class-any-link
[proposal]: http://dev.w3.org/csswg/selectors/
