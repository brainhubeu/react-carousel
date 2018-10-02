function factory(second) {
  var define = 'asdf';
  return second;
}

if (false) {
  System.import('x');
}

System.registerDynamic(['./second.js'], false, function ($__require, $__exports, $__module) {
  if (typeof factory === 'function') {
    return factory.call(this, $__require('./second.js'));
  } else {
    return factory;
  }
});
