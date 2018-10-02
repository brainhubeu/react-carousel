# hast-util-is-element [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

Check if a [node][] is a (certain) [**HAST**][hast] [element][].

## Installation

[npm][]:

```bash
npm install hast-util-is-element
```

**hast-util-is-element** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

## Usage

Dependencies:

```javascript
var isElement = require('hast-util-is-element');
```

Given a non-element:

```javascript
var result = isElement({
    'type': 'text',
    'value': 'foo'
});
```

Yields:

```js
false
```

Given a matching element:

```javascript
result = isElement({
    'type': 'element',
    'tagName': 'a'
}, 'a');
```

Yields:

```js
true
```

Given multiple tagNames:

```javascript
result = isElement({
    'type': 'element',
    'tagName': 'a'
}, ['a', 'area']);
```

Yields:

```js
true
```

## API

### `isElement(node[, tagName|tagNames])`

Check if a [node][] is a (certain) [**HAST**][hast] [element][].

When not given a second parameter, asserts if `node` is an element,
otherwise asserts `node` is an element whose `tagName` matches / is
included in the second parameter.

**Parameters**:

*   `node` (`*`) — Value to check;
*   `tagName` (`string`, optional) — Value `node`s `tagName` must match;
*   `tagNames` (`string`, optional) — Value including `node`s `tagName`.

**Returns**: `boolean`, whether `node` passes the test.

**Throws**: when the second parameter is given but invalid.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/wooorm/hast-util-is-element.svg

[build-page]: https://travis-ci.org/wooorm/hast-util-is-element

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/hast-util-is-element.svg

[coverage-page]: https://codecov.io/github/wooorm/hast-util-is-element?branch=master

[npm]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/hast-util-is-element/releases

[license]: LICENSE

[author]: http://wooorm.com

[hast]: https://github.com/wooorm/hast

[node]: https://github.com/wooorm/hast#node

[element]: https://github.com/wooorm/hast#element
