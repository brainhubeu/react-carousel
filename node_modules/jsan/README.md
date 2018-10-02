jsan
===

[![Build Status](https://travis-ci.org/kolodny/jsan.svg?branch=master)](https://travis-ci.org/kolodny/jsan)

### JavaScript "All The Things" Notation  
![jsan](https://i.imgur.com/IdKDIB6.png)

Easily stringify and parse any object including objects with circular references, self references, dates, regexes, `undefined`, errors, and even functions
<sub>[1](#functions)</sub>, using the familar `parse` and `stringify` methods.

There are two ways to use this library, the first is to be able to
serialize without having to worry about circular references,
the second way is be able to handle dates, regexes, errors, functions
<sub>[1](#functions)</sub>, errors, and undefined (normally
`JSON.stringify({ u: undefined }) === '{}'`)

The usage reflect these two approaches. If you just want to be
able to serialize an object then use `jsan.stringify(obj)`,
if you want to JSON all the things then use it like
`jsan.stringify(obj, null, null, true)`, the first three
arguments are the same as `JSON.stringify` (yup, `JSON.stringify`
takes three arguments)

Note that `jsan.stringify(obj, null, null, true)` will also deal
with circular references


### Usage

```js
var jsan = require('jsan');

var obj = {};
obj['self'] = obj;
obj['sub'] = {};
obj['sub']['subSelf'] = obj['sub'];
obj.now = new Date(2015, 0, 1);

var str = jsan.stringify(obj);
str === '{"self":{"$jsan":"$"},"sub":{"subSelf":{"$jsan":"$.sub"}},"now":"2015-01-01T05:00:00.000Z"}'; // true
var str2 = jsan.stringify(obj, null, null, true);
str2 === '{"self":{"$jsan":"$"},"sub":{"subSelf":{"$jsan":"$.sub"}},"now":{"$jsan":"d1420088400000"}}'; // true

var newObj1 = jsan.parse(str);
newObj1 === newObj1['self']; // true
newObj1['sub']['subSelf'] === newObj1['sub']; // true
typeof newObj1.now === 'string'; // true

var newObj2 = jsan.parse(str2);
newObj2 === newObj2['self']; // true
newObj2['sub']['subSelf'] === newObj2['sub']; // true
newObj2.now instanceof Date; // true
```

#### Notes

This ulitilty has been heavily optimized and performs as well as the native `JSON.parse` and
`JSON.stringify`, for usages of `jsan.stringify(obj)` when there are no circular references. 
It does this by first `try { JSON.stringify(obj) }` and only when that fails, will it walk
the object. Because of this it won't property handle self references that aren't circular by
default. You can work around this by passing false as the fourth argument, or pass true and it
will also handle dates, regexes, `undefeined`, errors, and functions

```js
var obj = { r: /test/ };
var subObj = {};
obj.a = subObj;
obj.b = subObj;
var str1 = jsan.stringify(obj) // '{"r":{},a":{},"b":{}}'
var str2 = jsan.stringify(obj, null, null, false) // '{"r":{},"a":{},"b":{"$jsan":"$.a"}}'
var str3 = jsan.stringify(obj, null, null, true) // '{"r":{"$jsan":"r,test"},"a":{},"b":{"$jsan":"$.a"}}'
```

##### Functions

You can't execute the functions after `stringify()` and `parse()`, they are just functions
that throw which have a `toString()` method similar to the original function

### Advance Usage

You can specify how and what should be handled by passing an object as the fourth argument:

```js
var obj = { u: undefined, r: /test/, f: function bar() {} };
var str = jsan.stringify(obj, null, null, { undefined: true, function: true }); // '{"u":{"$jsan":"u"},"r":{},"f":{"$jsan":"ffunction bar() { /* ... */ }"}}'
```

The `function` property of options can also take a function which will be used as the
function stringifyer:

```js
var obj = { u: undefined, r: /test/, f: function(x) { return x + 1 } };
var str = jsan.stringify(obj, null, null, {
  undefined: true,
  function: function(fn) { return fn.toString() }
});
str === '{"u":{"$jsan":"u"},"r":{},"f":{"$jsan":"ffunction (x) { return x + 1 }"}}'; // true
```
