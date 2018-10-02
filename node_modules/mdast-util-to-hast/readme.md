# mdast-util-to-hast [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [MDAST][] to [HAST][].

> **Note** You probably want to use [remark-rehype][].

## Installation

[npm][]:

```bash
npm install mdast-util-to-hast
```

## Usage

Say we have the following `example.md`:

```markdown
## Hello **World**!
```

...and next to it, `example.js`:

```javascript
var inspect = require('unist-util-inspect');
var unified = require('unified');
var parse = require('remark-parse');
var vfile = require('to-vfile');
var toHAST = require('mdast-util-to-hast');

var tree = unified().use(parse).parse(vfile.readSync('example.md'));

console.log(inspect(toHAST(tree)));
```

Which when running with `node example` yields:

```txt
root[1] (1:1-2:1, 0-20)
└─ element[3] (1:1-1:20, 0-19) [tagName="h2"]
   ├─ text: "Hello " (1:4-1:10, 3-9)
   ├─ element[1] (1:10-1:19, 9-18) [tagName="strong"]
   │  └─ text: "World" (1:12-1:17, 11-16)
   └─ text: "!" (1:19-1:20, 18-19)
```

## API

### `toHAST(node[, options])`

Transform the given [MDAST][] tree to a [HAST][] tree.

###### `options.allowDangerousHTML`

Whether to allow `html` nodes and inject them as raw HTML (`boolean`,
default: `false`).  Only do this when compiling later with
`hast-util-to-html`.

###### `options.commonmark`

Set to `true` (default: `false`) to prefer the first when duplicate definitions
are found.  The default behaviour is to prefer the last duplicate definition.

###### `options.handlers`

Object mapping [MDAST nodes][mdast] to functions
handling those elements.
Take a look at [`lib/handlers/`][handlers] for examples.

###### Returns

[`HASTNode`][hast].

###### Note

*   [`yaml`][mdast-yaml] and [`html`][mdast-html] nodes are ignored
*   [`position`][unist-position]s are properly patched
*   Unknown nodes with `children` are transformed to `div` elements
*   Unknown nodes with `value` are transformed to `text` nodes
*   If `node.data.hName` is set, it’s used as the HAST element’s tag-name
*   If `node.data.hProperties` is set, it’s mixed into the HAST element’s
    properties
*   If `node.data.hChildren` is set, it’s used as the element’s HAST
    children

## Related

*   [`mdast-util-to-nlcst`](https://github.com/syntax-tree/mdast-util-to-nlcst)
    — Transform MDAST to NLCST
*   [`hast-util-sanitize`](https://github.com/syntax-tree/hast-util-sanitize)
    — Sanitize HAST nodes
*   [`hast-util-to-mdast`](https://github.com/syntax-tree/hast-util-to-mdast)
    — Transform HAST to MDAST
*   [`remark-rehype`](https://github.com/wooorm/remark-rehype)
    — rehype support for remark
*   [`rehype-remark`](https://github.com/wooorm/remark-remark)
    — remark support for rehype

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/mdast-util-to-hast.svg

[travis]: https://travis-ci.org/syntax-tree/mdast-util-to-hast

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-to-hast.svg

[codecov]: https://codecov.io/github/syntax-tree/mdast-util-to-hast

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[mdast-yaml]: https://github.com/syntax-tree/mdast#yaml

[mdast-html]: https://github.com/syntax-tree/mdast#html

[unist-position]: https://github.com/syntax-tree/unist#location

[handlers]: lib/handlers

[remark-rehype]: https://github.com/wooorm/remark-rehype
