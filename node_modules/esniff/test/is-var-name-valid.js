'use strict';

module.exports = function (t, a) {
	a(t('foo'), true);
	a(t('if'), false);
	a(t('_if'), true);
	a(t('-if'), false);
};
