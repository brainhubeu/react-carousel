# babel-plugin-transform-cjs-system-wrapper

Wraps CommonJS scripts into `System.registerDynamic(...`

## Example

**In**

```js
'use strict';

var foo = require('foo/');
```

**Babel Options**
```js
{
  moduleId: 'foobar'
  plugins: [
    ['transform-cjs-system-wrapper', {
      deps: ['bar'],
      globals: {
        f: foo
      }
    }]
  ]
}
```

**Out**

```js
System.registerDynamic('foobar', ['bar'], true, function ($__require, exports, module) {
  'use strict';

  var f = $__require('foo');
  var global = this,
      GLOBAL = this;
  var foo = $__require('foo');
});
```

## Installation

```sh
$ npm install babel-plugin-transform-cjs-system-wrapper
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "moduleId": "foobar",
  "plugins": [
    ["transform-cjs-system-wrapper", {
      "systemGlobal": "SystemJS",
      "path": "/path/to/foobar",
      "optimize": true,
      "static": true,
      "deps": ["bar"],
      "esModule": true,
      "globals": {
        "f": "foo"
      }
    }]
  ]
}
```

### Via CLI

```sh
$ babel --plugins transform-cjs-system-wrapper script.js
```

### Via Node API (Recommended)

```javascript
require("babel-core").transform("code", {
  moduleId: 'foobar', // optional (default: '')
  plugins: [
    ["transform-cjs-system-wrapper", {
      requireName: 'require' // (default: 'require')
      systemGlobal: "SystemJS", // optional (default: 'SystemJS')
      path: "/path/to/foobar", // optional (default: '')
      optimize: true, // optional (default: false)
      static: true, // optional (default: false)
      deps: ['bar'], // optional (default: []),
      esModule: true, // optional (default: false)
      map: function(dep) {
        return mappedDep
      }, // (default: identity)
      globals: {  // optional (default: {})
        f: foo
      }
    }]
  ]
});
```
