var factory = { amd: 'object' };

// a factory identifier with no dependencies needs a typeof check in the output
// this check can probably be inlined by static analysis for certain cases
define(factory);