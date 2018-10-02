/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module rehype:lint:util:is-element
 */

'use strict';

/* eslint-env commonjs */

/**
 * Check if a node is a (certain) element.
 *
 * @param {*} node - Thing to check.
 * @param {string|Array.<string>?} [tagNames] - Name of element.
 * @return {boolean} - Whether a node is a (certain) element.
 * @throws {Error} - When `tagNames` is given but invalid.
 */
function isElement(node, tagNames) {
    var name;

    if (
        !(
            tagNames === null ||
            tagNames === undefined ||
            typeof tagNames === 'string' ||
            (typeof tagNames === 'object' && tagNames.length)
        )
    ) {
        throw new Error(
            'Expected `string` or `Array.<string>` for ' +
            '`tagNames`, not `' + tagNames + '`'
        );
    }

    if (
        !node ||
        typeof node !== 'object' ||
        node.type !== 'element' ||
        typeof node.tagName !== 'string'
    ) {
        return false;
    }

    if (tagNames === null || tagNames === undefined) {
        return true;
    }

    name = node.tagName;

    if (typeof tagNames === 'string') {
        return name === tagNames;
    }

    return tagNames.indexOf(name) !== -1;
}

/*
 * Expose.
 */

module.exports = isElement;
