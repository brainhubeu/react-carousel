'use strict';

var mdast2nlcst = require('mdast-util-to-nlcst');

module.exports = remark2retext;

/* Attacher.
 * If a destination processor is given, runs the destination
 * with the new NLCST tree (bridge-mode).
 * If a parser is given, returns the NLCST tree: further
 * plug-ins run on that tree (mutate-mode). */
function remark2retext(destination, options) {
  var fn = destination && destination.run ? bridge : mutate;
  return fn(destination, options);
}

/* Mutate-mode.  Further transformers run on the NLCST tree. */
function mutate(parser, options) {
  return transformer;
  function transformer(node, file) {
    return mdast2nlcst(node, file, parser, options);
  }
}

/* Bridge-mode.  Runs the destination with the new NLCST
 * tree. */
function bridge(destination, options) {
  return transformer;
  function transformer(node, file, next) {
    var Parser = destination.freeze().Parser;
    var tree = mdast2nlcst(node, file, Parser, options);
    destination.run(tree, file, done);
    function done(err) {
      next(err);
    }
  }
}
