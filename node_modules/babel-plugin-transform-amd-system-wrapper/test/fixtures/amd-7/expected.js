var factory = { amd: 'object' };

// a factory identifier with no dependencies needs a typeof check in the output
// this check can probably be inlined by static analysis for certain cases
System.registerDynamic([], false, function ($__require, $__exports, $__module) {
  if (typeof factory === 'function') {
    return factory.call(this);
  } else {
    return factory;
  }
});
