'use strict';

exports.__esModule = true;
exports.default = configureStore;

var _reduxDevtoolsInstrument = require('redux-devtools-instrument');

var _reduxDevtoolsInstrument2 = _interopRequireDefault(_reduxDevtoolsInstrument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(next, subscriber, options) {
  return (0, _reduxDevtoolsInstrument2.default)(subscriber, options)(next);
}