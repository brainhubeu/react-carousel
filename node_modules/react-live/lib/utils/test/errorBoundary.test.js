'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _errorBoundary = require('../transpile/errorBoundary');

var _errorBoundary2 = _interopRequireDefault(_errorBoundary);

var _enzyme = require('enzyme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

jest.useFakeTimers();

describe('errorBoundary', function () {
  it('should wrap PFCs in an error boundary', function () {
    var errorCb = jest.fn();

    (0, _errorBoundary2.default)(function () {
      throw new Error('test');
    }, errorCb)();

    jest.runOnlyPendingTimers();

    expect(errorCb).toHaveBeenCalledWith(new Error('test'));
  });

  it('should wrap Components in an error boundary', function () {
    var errorCb = jest.fn();
    var Component = (0, _errorBoundary2.default)(function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      _class.prototype.render = function render() {
        throw new Error('test');
      };

      return _class;
    }(_react2.default.Component), errorCb);

    (0, _enzyme.shallow)(_react2.default.createElement(Component, null));

    jest.runOnlyPendingTimers();

    expect(errorCb).toHaveBeenCalledWith(new Error('test'));
  });
});