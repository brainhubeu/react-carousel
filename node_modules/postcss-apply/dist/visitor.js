'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _balancedMatch = require('balanced-match');

var _balancedMatch2 = _interopRequireDefault(_balancedMatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RE_PROP_SET = /^(--)([\w-]+)(\s*)([:;]?)$/;

var Visitor = function () {
  function Visitor() {
    _classCallCheck(this, Visitor);

    this.cache = {};
    this.result = {};
  }

  _createClass(Visitor, [{
    key: 'collect',
    value: function collect(rule) {
      var matches = RE_PROP_SET.exec(rule.selector);
      var parent = rule.parent;

      if (!matches) {
        return;
      }

      if (parent.selector !== ':root') {
        return rule.warn(this.result, 'Custom properties sets are only allowed on `:root` rules.');
      }

      this.cache[matches[2]] = rule;
      rule.remove();

      if (!parent.nodes.length) {
        parent.remove();
      }
    }

    /**
     *  Allow parens usage for Polymer integration.
     */

  }, {
    key: 'getParamValue',
    value: function getParamValue(param) {
      return (/^\(/.test(param) ? (0, _balancedMatch2.default)('(', ')', param).body : param
      );
    }
  }, {
    key: 'replace',
    value: function replace(atRule) {
      var param = this.getParamValue(atRule.params);
      var matches = RE_PROP_SET.exec(param);

      if (!matches) {
        return;
      }

      var setName = matches[2];

      if (setName in this.cache) {
        atRule.replaceWith(this.cache[setName].nodes);
      } else {
        atRule.warn(this.result, 'No custom properties set declared for `' + setName + '`.');
      }
    }
  }]);

  return Visitor;
}();

exports.default = Visitor;