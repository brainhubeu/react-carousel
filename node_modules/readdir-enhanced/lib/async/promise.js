'use strict';

if (typeof Promise === 'function') {
  module.exports = Promise;
}
else {
  module.exports = require('es6-promise').Promise;
}
