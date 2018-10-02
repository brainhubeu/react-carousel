var Pool = require('../pool');
var exec = require('child_process').exec;

test('Controls concurrency', function(done) {
  var pool = new Pool(5);

  var count = 0;
  var counts = [];
  function f() {
    return new Promise(function(resolve) {
      count++;
      counts.push(count);
      exec('sleep 0.01', function() {
        count--;
        resolve();
      });
    });
  }
  var calls = [];
  for (var i=0; i<100; i++)
    calls[i] = pool.execute(f);

  Promise.all(calls)
  .then(function() {
    var i;
    // burn in, number running == number executed
    for (i=0; i<5; i++)
      assert.equal(counts[i],i + 1);
    // maxed out, number running == pool max
    for (i=4; i<100; i++)
      assert.equal(counts[i], 5);
  })
  .then(done)
  .catch(done);
});
