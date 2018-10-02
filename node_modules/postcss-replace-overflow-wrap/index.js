var postcss = require('postcss');

module.exports = postcss.plugin('postcss-replace-overflow-wrap', function (opts) {
    opts = opts || {};
    var method = opts.method || 'replace';

    return function (css, result) { // eslint-disable-line no-unused-vars
        css.walkRules(function (rule) {
            rule.walkDecls(function (decl, i) { // eslint-disable-line no-unused-vars
                if (decl.prop === 'overflow-wrap') {
                    decl.cloneBefore({ prop: 'word-wrap' });
                    if (method === 'replace') {
                        decl.remove();
                    }
                }
            });
        });
    };
});
