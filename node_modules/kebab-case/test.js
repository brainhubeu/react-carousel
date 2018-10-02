'use strict';
const test = require('ava');
const kebabCase = require('./');

test('string with uppercased letters', t => {
	t.is(kebabCase('helloWorld'), 'hello-world');
	t.is(kebabCase('hello World!'), 'hello -world!');
});

test('string without uppercased letters', t => {
	t.is(kebabCase('hello world'), 'hello world');
	t.is(kebabCase('-- hello world --'), '-- hello world --');
});

test('string with leading uppercased letters', t => {
	t.is(kebabCase('WebkitTransform'), '-webkit-transform');
	t.is(kebabCase('Mr. Kebab'), '-mr. -kebab');
});

test('string with international uppercased letters', t => {
	t.is(kebabCase('ølÜberÅh'), 'øl-über-åh');
	t.is(kebabCase('Érnest'), '-érnest');
});

test('the reverse', t => {
	const str = 'Hallå, Mr. Kebab Überstein! How you doin\'?-';
	t.is(kebabCase.reverse(kebabCase(str)), str);
});
