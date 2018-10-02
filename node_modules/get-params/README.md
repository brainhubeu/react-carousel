# get-params

[![Build Status](https://secure.travis-ci.org/fahad19/get-params.png?branch=master)](http://travis-ci.org/fahad19/get-params)

Get a list of function's argument variable names (parameters).

## Install

```
$ npm install --save get-params
```

## Usage

```js
var getParams = require('get-params');

var myFunction = function (one, two, three) {
	return 'blah';
};

var params = getParams(myFunction);
console.log(params); // ['one', 'two', 'three']
```

### Browser

You can also run it in the browser. Install it with bower:

```
$ bower install --save get-params
```

Include the script in your HTML:

```html
<script src="./bower_components/get-params/index.js"></script>
```

The library will be available in `window.GetParams`:

```js
var params = GetParams(myFunction);
```

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
