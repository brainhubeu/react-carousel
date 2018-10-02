'use strict';
const PNG = require('pngjs').PNG;

module.exports = (buf, opts) => {
	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	return new Promise((resolve, reject) => {
		let png = new PNG(opts);

		png.on('metadata', data => {
			png = Object.assign(png, data);
		});

		png.on('error', reject);
		png.on('parsed', () => resolve(png));

		png.end(buf);
	});
};
