"use strict";

var invariant = require(`invariant`);
var nonAlphaNumericExpr = new RegExp(`[^a-zA-Z0-9_]`, `g`);

/**
 * GraphQL field names must be a string and cannot contain anything other than
 * alphanumeric characters and `_`. They also can't start with `__` which is
 * reserved for internal fields (`___foo` doesn't work either).
 */
module.exports = function (key) {
  // Check if the key is really a string otherwise GraphQL will throw.
  invariant(typeof key === `string`, `Graphql field name (key) is not a string -> ${key}`);

  var replaced = key.replace(nonAlphaNumericExpr, `_`);

  // key is invalid; normalize with leading underscore and rest with x
  if (replaced.match(/^__/)) {
    return replaced.replace(/_/g, function (char, index) {
      return index === 0 ? `_` : `x`;
    });
  }

  return replaced;
};
//# sourceMappingURL=create-key.js.map