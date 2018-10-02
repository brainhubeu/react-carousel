# parse-png [![Build Status](https://travis-ci.org/kevva/parse-png.svg?branch=master)](https://travis-ci.org/kevva/parse-png)

> Parse a PNG


## Install

```
$ npm install --save parse-png
```


## Usage

```js
const fs = require('fs');
const parsePng = require('parse-png');

parsePng(fs.readFileSync('unicorn.png')).then(png => {
	console.log(png);
	/*
	{
		width: 200,
		height: 133,
		depth: 8,
		interlace: false,
		palette: false,
		color: true,
		alpha: false,
		bpp: 3,
		colorType: 2,
		data: <Buffer 29 48 4d ...>,
	}
	*/

	png.adjustGamma();
	png.pack().pipe(fs.createWriteStream('unicorn-adjusted.png'));
});
```


## API

### parsePng(buffer, [options])

Returns a promise for a PNG instance. See the [pngjs documentation](https://github.com/lukeapage/pngjs#async-api) for more information.

#### buffer

Type: `buffer`

A PNG image buffer.

#### options

Type: `object`

See the [pngjs options](https://github.com/lukeapage/pngjs#options).


## License

MIT © [Kevin Martensson](http://github.com/kevva)
