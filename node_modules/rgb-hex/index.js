'use strict';
module.exports = function (red, green, blue) {
	if ((typeof red !== 'number' || typeof green !== 'number' || typeof blue !== 'number') &&
		(red > 255 || green > 255 || blue > 255)) {
		throw new TypeError('Expected three numbers below 256');
	}

	return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
};
