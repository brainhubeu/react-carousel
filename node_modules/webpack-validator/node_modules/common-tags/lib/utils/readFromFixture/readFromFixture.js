'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readFromFixture;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _node = require('when/node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * reads the text contents of <name>.txt in the fixtures folder
 * relative to the caller module's test file
 * @param  {String} name - the name of the fixture you want to read
 * @return {Promise<String>} - the retrieved fixture's file contents
 */
function readFromFixture(name) {
  return _node2.default.call(_fs2.default.readFile, './fixtures/' + name + '.txt', 'utf8').then(function (contents) {
    return contents.replace(/\r\n/g, '\n').trim();
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZWFkRnJvbUZpeHR1cmUvcmVhZEZyb21GaXh0dXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztrQkFXd0IsZTs7QUFUeEI7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBUWUsU0FBUyxlQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQzdDLFNBQU8sZUFBSyxJQUFMLENBQVUsYUFBRyxRQUFiLGtCQUFxQyxJQUFyQyxXQUFpRCxNQUFqRCxFQUNKLElBREksQ0FDQyxVQUFDLFFBQUQ7QUFBQSxXQUFjLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQixJQUExQixFQUFnQyxJQUFoQyxFQUFkO0FBQUEsR0FERCxDQUFQO0FBRUQiLCJmaWxlIjoicmVhZEZyb21GaXh0dXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBub2RlIGZyb20gJ3doZW4vbm9kZSdcblxuLyoqXG4gKiByZWFkcyB0aGUgdGV4dCBjb250ZW50cyBvZiA8bmFtZT4udHh0IGluIHRoZSBmaXh0dXJlcyBmb2xkZXJcbiAqIHJlbGF0aXZlIHRvIHRoZSBjYWxsZXIgbW9kdWxlJ3MgdGVzdCBmaWxlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZml4dHVyZSB5b3Ugd2FudCB0byByZWFkXG4gKiBAcmV0dXJuIHtQcm9taXNlPFN0cmluZz59IC0gdGhlIHJldHJpZXZlZCBmaXh0dXJlJ3MgZmlsZSBjb250ZW50c1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWFkRnJvbUZpeHR1cmUgKG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuY2FsbChmcy5yZWFkRmlsZSwgYC4vZml4dHVyZXMvJHtuYW1lfS50eHRgLCAndXRmOCcpXG4gICAgLnRoZW4oKGNvbnRlbnRzKSA9PiBjb250ZW50cy5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpLnRyaW0oKSlcbn1cbiJdfQ==