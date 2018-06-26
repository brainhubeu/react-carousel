"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class CarouselItem extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    this.onTouchStart = event => {
      this.props.onTouchStart(event, this.props.index);
    };
  }

  render() {
    return _react.default.createElement("li", {
      className: (0, _classnames.default)('BrainhubCarouselItem', {
        'BrainhubCarouselItem--clickable': this.props.clickable,
        'BrainhubCarouselItem--active': this.props.index === this.props.currentSlideIndex
      }),
      style: {
        paddingRight: `${this.props.offset / 2}px`,
        paddingLeft: `${this.props.offset / 2}px`,
        width: `${this.props.width}px`,
        maxWidth: `${this.props.width}px`,
        minWidth: `${this.props.width}px`
      },
      onTouchStart: this.onTouchStart
    }, this.props.children);
  }

}

exports.default = CarouselItem;
CarouselItem.propTypes = {
  onMouseDown: _propTypes.default.func,
  onTouchStart: _propTypes.default.func,
  clickable: _propTypes.default.bool,
  children: _propTypes.default.node,
  width: _propTypes.default.number,
  offset: _propTypes.default.number,
  index: _propTypes.default.number,
  currentSlideIndex: _propTypes.default.number
};