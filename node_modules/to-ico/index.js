'use strict';
const arrify = require('arrify');
const bufferAlloc = require('buffer-alloc');
const imageSize = require('image-size');
const parsePng = require('parse-png');
const resizeImg = require('resize-img');

const constants = {
	bitmapSize: 40,
	colorMode: 0,
	directorySize: 16,
	headerSize: 6
};

const createHeader = n => {
	const buf = bufferAlloc(constants.headerSize);

	buf.writeUInt16LE(0, 0);
	buf.writeUInt16LE(1, 2);
	buf.writeUInt16LE(n, 4);

	return buf;
};

const createDirectory = (data, offset) => {
	const buf = bufferAlloc(constants.directorySize);
	const size = data.data.length + constants.bitmapSize;
	const width = data.width === 256 ? 0 : data.width;
	const height = data.height === 256 ? 0 : data.height;
	const bpp = data.bpp * 8;

	buf.writeUInt8(width, 0);
	buf.writeUInt8(height, 1);
	buf.writeUInt8(0, 2);
	buf.writeUInt8(0, 3);
	buf.writeUInt16LE(1, 4);
	buf.writeUInt16LE(bpp, 6);
	buf.writeUInt32LE(size, 8);
	buf.writeUInt32LE(offset, 12);

	return buf;
};

const createBitmap = (data, compression) => {
	const buf = bufferAlloc(constants.bitmapSize);

	buf.writeUInt32LE(constants.bitmapSize, 0);
	buf.writeInt32LE(data.width, 4);
	buf.writeInt32LE(data.height * 2, 8);
	buf.writeUInt16LE(1, 12);
	buf.writeUInt16LE(data.bpp * 8, 14);
	buf.writeUInt32LE(compression, 16);
	buf.writeUInt32LE(data.data.length, 20);
	buf.writeInt32LE(0, 24);
	buf.writeInt32LE(0, 28);
	buf.writeUInt32LE(0, 32);
	buf.writeUInt32LE(0, 36);

	return buf;
};

const createDib = (data, width, height, bpp) => {
	const cols = width * bpp;
	const rows = height * cols;
	const end = rows - cols;
	const buf = bufferAlloc(data.length);

	for (let row = 0; row < rows; row += cols) {
		for (let col = 0; col < cols; col += bpp) {
			let pos = row + col;

			const r = data.readUInt8(pos);
			const g = data.readUInt8(pos + 1);
			const b = data.readUInt8(pos + 2);
			const a = data.readUInt8(pos + 3);

			pos = (end - row) + col;

			buf.writeUInt8(b, pos);
			buf.writeUInt8(g, pos + 1);
			buf.writeUInt8(r, pos + 2);
			buf.writeUInt8(a, pos + 3);
		}
	}

	return buf;
};

const generateIco = data => {
	return Promise.all(data.map(x => parsePng(x))).then(data => {
		const header = createHeader(data.length);
		const arr = [header];

		let len = header.length;
		let offset = constants.headerSize + (constants.directorySize * data.length);

		for (const x of data) {
			const dir = createDirectory(x, offset);
			arr.push(dir);
			len += dir.length;
			offset += x.data.length + constants.bitmapSize;
		}

		for (const x of data) {
			const header = createBitmap(x, constants.colorMode);
			const dib = createDib(x.data, x.width, x.height, x.bpp);
			arr.push(header, dib);
			len += header.length + dib.length;
		}

		return Buffer.concat(arr, len);
	});
};

const resizeImages = (data, opts) => {
	data = data
		.map(x => {
			const size = imageSize(x);

			return {
				data: x,
				width: size.width,
				height: size.height
			};
		})
		.reduce((a, b) => a.width > b.width ? a : b, {});

	return Promise.all(opts.sizes.filter(x => x <= data.width).map(x => resizeImg(data.data, {
		width: x,
		height: x
	})));
};

module.exports = (input, opts) => {
	const data = arrify(input);

	opts = Object.assign({
		resize: false,
		sizes: [16, 24, 32, 48, 64, 128, 256]
	}, opts);

	if (opts.resize) {
		return resizeImages(data, opts).then(generateIco);
	}

	return generateIco(data);
};
