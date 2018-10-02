var github = require('./github');

github = new github({
  baseDir: '.',
  log: true,
  tmpDir: '.',
  username: '',
  password: ''
});

github.lookup('angular/bower-angular')
  .then(function(versions) {
    console.log(versions);
    return github.download('angular/bower-angular', 'v1.2.12', 'e8a1df5f060bf7e6631554648e0abde150aedbe4', {}, 'test-repo');
  })
  .then(function() {
    console.log('done');
  })
  .catch(function(err) {
    console.log(err);
  });
