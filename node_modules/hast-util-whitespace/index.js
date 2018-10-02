/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module hast:util:whitespace
 * @fileoverview Check whether a node is inter-element
 *   whitespace.
 */

'use strict';

/* eslint-env commonjs */

/*
 * HTML white-space expression.
 *
 * See <https://html.spec.whatwg.org/#space-character>.
 */

var EXPRESSION = /[\ \t\n\f\r]/g;

/**
 * Check if `node` is a inter-element white-space.
 *
 * @param {Node|string} node - Value to check, or Node
 *   whose value to check.
 * @return {boolean} - Whether `node` is inter-element
 *   white-space.
 */
function interElementWhiteSpace(node) {
    var value;

    if (node && typeof node === 'object' && node.type === 'text') {
        value = node.value || ''
    } else if (typeof node === 'string') {
        value = node;
    } else {
        return false;
    }

    return value.replace(EXPRESSION, '') === '';
}

/*
 * Expose.
 */

module.exports = interElementWhiteSpace;
