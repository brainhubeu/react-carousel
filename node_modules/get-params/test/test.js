var getParams = require('../');
var assert = require('assert');

describe('get-params', function () {
	it('should get params from a function', function () {
		var myFunction = function (one, two, three) {
			return (one * two * three);
		};

		var params = getParams(myFunction);
		assert.deepEqual(params, [
			'one',
			'two',
			'three'
		]);
	});

	it('should get empty params from a function with no args', function () {
		var myFunction = function () {
			return null;
		};

		var params = getParams(myFunction);
		assert.deepEqual(params, []);
	});

	it('should get empty params from an invalid function', function () {
		var myFunction = 'I am a string!';

		var params = getParams(myFunction);
		assert.deepEqual(params, []);
	});
});
