<img src="assets/jspm.png" alt="JSPM Logo" width="200" height="200"/>

# Package Resolve <br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status][ci-img]][ci] [![Dependencies][deps-img]][deps]

Package Resolver (JSPM+NPM) which supports JavaScript and CSS packages. Preferes ES6 Module files following `jsnext:main` flag in package configuration. Also respects alternative `style` entries as main package entry point.

The solution was mainly thought for offering a powerful JSPM-capable include mechanism for PostCSS.

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[ci-img]:  https://travis-ci.org/sebastian-software/pkg-resolve.svg
[ci]:      https://travis-ci.org/sebastian-software/pkg-resolve
[deps-img]: https://david-dm.org/sebastian-software/pkg-resolve.svg
[deps]: https://david-dm.org/sebastian-software/pkg-resolve
[npm]: https://www.npmjs.com/package/pkg-resolve
[npm-downloads-img]: https://img.shields.io/npm/dm/pkg-resolve.svg
[npm-version-img]: https://img.shields.io/npm/v/pkg-resolve.svg


## Links

- [GitHub](https://github.com/sebastian-software/pkg-resolve)
- [NPM](https://www.npmjs.com/package/pkg-resolve)


## Installation

Should be installed locally in your project source code:

```bash
npm install pkg-resolve --save-dev
```

## Usage

Integrate like this in your e.g. `gulpfile.js` or other packages:

```js
import resolver from "pkg-resolve"

resolver("lodash/map").then((path) => {
  console.log("Path of lodash/map implementation:", path)
});

resolver("normalize.css").then((path) => {
  console.log("Path of normalize.css main entry:", path)
});
```

## Usage for PostCSS

You are also able to combine the import functionality with [PostCSS Import](https://github.com/postcss/postcss-import). That's pretty neat to include CSS files and other referenced assets which are installed with JSPM inside the local project.

1. Install normalize.css: `jspm install npm:normalize.css`
2. Include it via PostCSS include: `@import "normalize.css";`


## Copyright

<img src="assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2016<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)

