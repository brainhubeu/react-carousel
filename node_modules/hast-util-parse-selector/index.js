'use strict';

/* Expose. */
module.exports = parse;

/* Characters */
var dot = '.'.charCodeAt(0);
var hash = '#'.charCodeAt(0);

/* Parse a simple CSS selector into a HAST node. */
function parse(selector) {
  var id = null;
  var className = [];
  var value = selector || '';
  var name = 'div';
  var node;
  var type = null;
  var index = -1;
  var code;
  var length = value.length;
  var subvalue;
  var lastIndex;

  node = {
    type: 'element',
    tagName: null,
    properties: {},
    children: []
  };

  type = null;

  while (++index <= length) {
    code = value.charCodeAt(index);

    if (!code || code === dot || code === hash) {
      subvalue = value.slice(lastIndex, index);

      if (subvalue) {
        if (type === dot) {
          className.push(subvalue);
        } else if (type === hash) {
          id = subvalue;
        } else {
          name = subvalue;
        }
      }

      lastIndex = index + 1;
      type = code;
    }
  }

  node.tagName = name;

  if (id) {
    node.properties.id = id;
  }

  if (className.length !== 0) {
    node.properties.className = className;
  }

  return node;
}
