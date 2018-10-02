this.asdf = { obj: 'x' };

(function (exports) {
  this.another = 'y';

  exports.p = 'q';
}).call(this.asdf, this);
