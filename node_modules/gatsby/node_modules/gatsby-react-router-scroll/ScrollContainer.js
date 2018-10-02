"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _warning = require("warning");

var _warning2 = _interopRequireDefault(_warning);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  scrollKey: _propTypes2.default.string.isRequired,
  shouldUpdateScroll: _propTypes2.default.func,
  children: _propTypes2.default.element.isRequired
};

var contextTypes = {
  // This is necessary when rendering on the client. However, when rendering on
  // the server, this container will do nothing, and thus does not require the
  // scroll behavior context.
  scrollBehavior: _propTypes2.default.object
};

var ScrollContainer = function (_React$Component) {
  (0, _inherits3.default)(ScrollContainer, _React$Component);

  function ScrollContainer(props, context) {
    (0, _classCallCheck3.default)(this, ScrollContainer);

    // We don't re-register if the scroll key changes, so make sure we
    // unregister with the initial scroll key just in case the user changes it.
    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));

    _this.shouldUpdateScroll = function (prevRouterProps, routerProps) {
      var shouldUpdateScroll = _this.props.shouldUpdateScroll;

      if (!shouldUpdateScroll) {
        return true;
      }

      // Hack to allow accessing scrollBehavior._stateStorage.
      return shouldUpdateScroll.call(_this.context.scrollBehavior.scrollBehavior, prevRouterProps, routerProps);
    };

    _this.scrollKey = props.scrollKey;
    return _this;
  }

  ScrollContainer.prototype.componentDidMount = function componentDidMount() {
    this.context.scrollBehavior.registerElement(this.props.scrollKey, _reactDom2.default.findDOMNode(this), // eslint-disable-line react/no-find-dom-node
    this.shouldUpdateScroll);

    // Only keep around the current DOM node in development, as this is only
    // for emitting the appropriate warning.
    if (process.env.NODE_ENV !== "production") {
      this.domNode = _reactDom2.default.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    }
  };

  ScrollContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(nextProps.scrollKey === this.props.scrollKey, "<ScrollContainer> does not support changing scrollKey.") : void 0;
  };

  ScrollContainer.prototype.componentDidUpdate = function componentDidUpdate() {
    if (process.env.NODE_ENV !== "production") {
      var prevDomNode = this.domNode;
      this.domNode = _reactDom2.default.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(this.domNode === prevDomNode, "<ScrollContainer> does not support changing DOM node.") : void 0;
    }
  };

  ScrollContainer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.context.scrollBehavior.unregisterElement(this.scrollKey);
  };

  ScrollContainer.prototype.render = function render() {
    return this.props.children;
  };

  return ScrollContainer;
}(_react2.default.Component);

ScrollContainer.propTypes = propTypes;
ScrollContainer.contextTypes = contextTypes;

exports.default = ScrollContainer;