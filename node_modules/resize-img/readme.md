# resize-img [![Build Status](https://travis-ci.org/kevva/resize-img.svg?branch=master)](https://travis-ci.org/kevva/resize-img)

> Resize images in memory


## Install

```
$ npm install --save resize-img
```


## Usage

```js
const fs = require('fs');
const resizeImg = require('resize-img');

resizeImg(fs.readFileSync('unicorn.png'), {width: 128, height: 128}).then(buf => {
	fs.writeFileSync('unicorn-128x128.png', buf);
});
```


## API

### resizeImg(input, options)

#### input

Type: `buffer`

An image buffer. Supported formats are `bmp`, `jpg` and `png`.

#### options

##### width

Type: `number`

Desired width of the target image.

##### height

Type: `number`

Desired height of the target image.


## Related

* [resize-img-cli](https://github.com/kevva/resize-img-cli) - CLI for this module.


## License

MIT © [Kevin Martensson](http://github.com/kevva)
