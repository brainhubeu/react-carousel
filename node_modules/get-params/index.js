/* global window */
var GetParams = function (func) {
	'use strict';

	if (typeof func !== 'function') {
		return [];
	}

	var patternComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var patternArguments = /([^\s,]+)/g;

	var funcString = func
		.toString()
		.replace(patternComments, '');

	var result = funcString
		.slice(
			funcString.indexOf('(') + 1,
			funcString.indexOf(')')
		)
		.match(patternArguments);

	if (result === null) {
		return [];
	}

	return result;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = GetParams;
}

if (typeof window !== 'undefined') {
	window.GetParams = GetParams;
}
