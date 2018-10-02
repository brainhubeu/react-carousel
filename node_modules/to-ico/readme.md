# to-ico [![Build Status](https://travis-ci.org/kevva/to-ico.svg?branch=master)](https://travis-ci.org/kevva/to-ico)

> Convert PNG to ICO in memory


## Install

```
$ npm install --save to-ico
```


## Usage

```js
const fs = require('fs');
const toIco = require('to-ico');

const files = [
	fs.readFileSync('unicorn-16x16.png'),
	fs.readFileSync('unicorn-32x32.png')
];

toIco(files).then(buf => {
	fs.writeFileSync('favicon.ico', buf);
});
```


## API

### toIco(input, [options])

#### input

Type: `Array` `string`

Array of PNG image buffers.

The images must have a size of `16x16`, `24x24`, `32x32`, `48x48`, `64x64`, `128x128` or `256x256` and they must have an 8 bit per sample (channel) bit-depth (on Unix you can check this with the `file` command: RGB(A) is supported, while [colormap](https://en.wikipedia.org/wiki/Indexed_color) is not, because it's 8 bits per pixel instead of 8 bits per channel, which is 24 or 32 bits per pixel depending on the presence of the alpha channel). These are limitations in the underlying [`pngjs`](https://github.com/lukeapage/pngjs#pngjs) library. If you have a colormap PNG you can convert it to an RGB/RGBA PNG with commonly used image editing tools.

#### options

##### resize

Type: `boolean`<br>
Default: `false`

Use the largest image and resize to sizes defined using the [sizes](#sizes) option.

##### sizes

Type: `Array`<br>
Default: `[16, 24, 32, 48, 64, 128, 256]`

Array of sizes to use when resizing.


## Related

* [to-ico-cli](https://github.com/kevva/to-ico-cli) - CLI for this module


## License

MIT © [Kevin Martensson](http://github.com/kevva)
