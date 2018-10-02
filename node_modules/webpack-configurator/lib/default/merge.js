var _ = require("lodash");

// Used whenever _.merge is called to for consistency.
module.exports = function(a, b) {
    if (_.isArray(a)) {
        return a.concat(b);
    }
};
