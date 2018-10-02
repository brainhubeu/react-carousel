# unist-util-map [![Build Status][build-badge]][build-page]

Create a new Unist tree with all nodes that mapped by the provided function.

Helper for creating [unist: Universal Syntax Tree][unist].

*   [retext][], [remark][], [rehype][], [textlint][]

## Installation

```sh
npm install unist-util-map
```

## Usage

### `map(AST, function(node, index, parent){ /* return */ }): AST`

map function return new AST object.

```js
const assert = require('assert')
const assign = require('object-assign')
const map = require('unist-util-map')

// Input
const tree = {
  type: 'root',
  children: [
    {
      type: 'node',
      children: [{type: 'leaf', value: '1'}]
    },
    {type: 'leaf', value: '2'}
  ]
}

// Transform:
const actual = map(tree, function(node) {
  if (node.type === 'leaf') {
    return assign({}, node, {value: 'CHANGED'})
  }
  // No change
  return node
})

// Expected output:
const expected = {
  type: 'root',
  children: [
    {
      type: 'node',
      children: [{type: 'leaf', value: 'CHANGED'}]
    },
    {type: 'leaf', value: 'CHANGED'}
  ]
}

assert.deepEqual(actual, expected)
```

## Tests

```sh
npm test
```

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

See [`contribute.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][]

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-map.svg

[build-page]: https://travis-ci.org/syntax-tree/unist-util-map

[unist]: https://github.com/wooorm/unist "wooorm/unist: Universal Syntax Tree"

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md

[remark]: https://github.com/remarkjs/remark

[retext]: https://github.com/retextjs/retext

[rehype]: https://github.com/rehypejs/rehype

[textlint]: https://github.com/textlint/textlint

[mit]: LICENSE
