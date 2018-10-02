# babel-plugin-transform-amd-system-wrapper

Wraps AMD modules into `System.registerDynamic(...`

## Example

**In**

```js
define(['bar'], function(bar, require, module) {
  module.exports = {
	  bar: bar
  }
});
```

**Babel Options**
```js
{
  plugins: [
    ['transform-amd-system-wrapper', {
      map: function(dep) {
        return dep;
      }
    }]
  ]
}
```

**Out**

```js
System.registerDynamic(['bar'], false, function ($__require, $__exports, $__module) {
  'use strict';

  $__module.uri = $__module.id;
  return (function(bar, require, module) {
    module.exports = {
	  bar: bar
	}
  }).call(this, $__require('bar'), $__require, $__module);
});
```

## Installation

```sh
$ npm install babel-plugin-transform-amd-system-wrapper
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": [
    ["transform-amd-system-wrapper", {
      "systemGlobal": "SystemJS",
      "filterMode": false,
      "deps": []
    }]
  ]
}
```

### Via CLI

```sh
$ babel --plugins transform-amd-system-wrapper script.js
```

### Via Node API (Recommended)

```javascript
require("babel-core").transform("code", {
  plugins: [
    ["transform-amd-system-wrapper", {
      systemGlobal: "SystemJS", // Overwrites the default system global identifier. optional (default: 'System')
      filterMode: true, // Flag to disable the transformation process. Enables the filter mode to filter AMD dependencies which will be added to output.metadata.amdDeps. optional (default: false)
      esModule: true, // Indicates "__esModule" flag should be added to module if not already for named exports compatibility
      deps: [], // Array of additional dependencies to add to the registerDynamic dependencies array. optional (default: [])  
      map: function(dep) {
        return dep;
      } // Dependency mapping function hook. optional (default: identity)
    }]
  ]
});
```
