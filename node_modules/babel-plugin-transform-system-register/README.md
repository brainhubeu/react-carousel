# babel-plugin-transform-system-register

Converts anonymous `System.register([]` into named `System.register('name', [], ...`

## Example

**In**

```js
System.register([], function () {});
```

**Out**

```js
System.register("foo", [], function () {});
```

## Installation

```sh
$ npm install babel-plugin-transform-system-register
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": [
    ["transform-system-register", {
      "moduleName": "foo",
      "systemGlobal": "SystemJS"
    }]
  ]
}
```

### Via CLI

```sh
$ babel --plugins transform-system-register script.js
```

### Via Node API (Recommended)

```javascript
require("babel-core").transform("code", {
  plugins: [
    ["transform-system-register", {
      moduleName: "foo",
      systemGlobal: "SystemJS",
      map: function(name) {
        return normalize(name);
      }
    }]
  ]
});
```
