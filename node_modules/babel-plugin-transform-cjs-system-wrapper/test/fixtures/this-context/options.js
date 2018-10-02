module.exports = {
	systemGlobal: 'SystemJS',
	path: '/path/to/foobar',
	moduleName: 'foobar',
	optimize: true,
	static: false,
	globals: {
		f: 'foo'
	},
	deps: ['bar']
};