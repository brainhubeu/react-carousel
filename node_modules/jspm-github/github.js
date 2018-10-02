var fs = require('graceful-fs');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var request = require('request');
var expandTilde = require('expand-tilde');

var Promise = require('bluebird');
var asp = require('bluebird').Promise.promisify;

var tar = require('tar-fs');
var zlib = require('zlib');

var semver = require('semver');

var which = require('which');

function extend(dest, src) {
  for (var key in src) {
    dest[key] = src[key]
  }

  return dest;
}

try {
  var netrc = require('netrc')();
}
catch(e) {}

var execGit = require('./exec-git');

function createRemoteStrings(auth, hostname) {
  var authString = auth ? (encodeURIComponent(auth.username) + ':' + encodeURIComponent(auth.password) + '@') : '';
  hostname = hostname || 'github.com';

  this.remoteString = 'https://' + authString + hostname + '/';

  if (hostname == 'github.com')
    this.apiRemoteString = 'https://' + authString + 'api.github.com/';

  // Github Enterprise
  else
    this.apiRemoteString = 'https://' + authString + hostname + '/api/v3/';
}

// avoid storing passwords as plain text in config
function encodeCredentials(auth) {
  return new Buffer(auth.username + ':' + auth.password).toString('base64');
}
function decodeCredentials(str) {
  var auth = new Buffer(str, 'base64').toString('utf8').split(':');

  var username, password;

  try {
    username = decodeURIComponent(auth[0]);
    password = decodeURIComponent(auth[1]);
  }
  catch(e) {
    username = auth[0];
    password = auth[1];
  }

  return {
    username: username,
    password: password
  };
}

function readNetrc(hostname) {
  hostname = hostname || 'github.com';
  var creds = netrc[hostname];

  if (creds) {
    return {
      username: creds.login,
      password: creds.password
    };
  }
}

var GithubLocation = function(options, ui) {

  // ensure git is installed
  try {
    which.sync('git');
  }
  catch(ex) {
    throw 'Git not installed. You can install git from `http://git-scm.com/downloads`.';
  }

  this.name = options.name;

  this.max_repo_size = (options.maxRepoSize || 0) * 1024 * 1024;

  this.versionString = options.versionString + '.1';

  // Give the environment precedence over options object
  if(process.env.JSPM_GITHUB_AUTH_TOKEN) {
    options.auth = process.env.JSPM_GITHUB_AUTH_TOKEN;
  } else if (options.username && !options.auth) {
    options.auth = encodeCredentials(options);
    // NB deprecate old auth eventually
    // delete options.username;
    // delete options.password;
  }

  if (typeof options.auth == 'string') {
    this.auth = decodeCredentials(options.auth);
  }
  else {
    this.auth = readNetrc(options.hostname);
  }

  this.ui = ui;

  this.execOpt = {
    cwd: options.tmpDir,
    timeout: options.timeouts.download * 1000,
    killSignal: 'SIGKILL',
    maxBuffer: this.max_repo_size || 2 * 1024 * 1024,
    env: extend({}, process.env)
  };

  this.defaultRequestOptions = {
    strictSSL: 'strictSSL' in options ? options.strictSSL : true
  };

  if (!this.defaultRequestOptions.strictSSL) {
    this.execOpt.env.GIT_SSL_NO_VERIFY = '1'
  }

  var self = this, envMap = {
    ca: 'GIT_SSL_CAINFO',
    cert: 'GIT_SSL_CERT',
    key: 'GIT_SSL_KEY'
  };

  ['ca', 'cert', 'key'].forEach(function(key) {
    if (key in options) {
      var path = expandTilde(options[key]);
      self.execOpt.env[envMap[key]] = path;
      self.defaultRequestOptions[key] = fs.readFileSync(path, 'ascii');
    }
  });

  this.remote = options.remote;

  createRemoteStrings.call(this, this.auth, options.hostname);
};

function clearDir(dir) {
  return new Promise(function(resolve, reject) {
    fs.exists(dir, function(exists) {
      resolve(exists);
    });
  })
  .then(function(exists) {
    if (exists)
      return asp(rimraf)(dir);
  });
}

function prepDir(dir) {
  return clearDir(dir)
  .then(function() {
    return asp(mkdirp)(dir);
  });
}

// check if the given directory contains one directory only
// so that when we unzip, we should use the inner directory as
// the directory
function checkStripDir(dir) {
  return asp(fs.readdir)(dir)
  .then(function(files) {
    if (files.length > 1)
      return dir;

    if (!files.length)
      return dir;

    var dirPath = path.resolve(dir, files[0]);

    return asp(fs.stat)(dirPath)
    .then(function(stat) {
      if (stat.isDirectory())
        return dirPath;

      return dir;
    });
  });
}

function configureCredentials(config, ui) {
  var auth = {};

  return Promise.resolve()
  .then(function() {
    ui.log('info', 'If using two-factor authentication or to avoid using your password you can generate an access token at %https://' + (config.hostname || 'github.com') + '/settings/tokens%. Ensure it has `public_repo` scope access.');
    return ui.input('Enter your GitHub username');
  })
  .then(function(username) {
    auth.username = username;
    if (auth.username)
      return ui.input('Enter your GitHub password or access token', null, true);
  })
  .then(function(password) {
    auth.password = password;
    if (!auth.username)
      return false;

    return ui.confirm('Would you like to test these credentials?', true);
  })
  .then(function(test) {
    if (!test)
      return true;

    return Promise.resolve()
    .then(function() {
      var remotes = {};
      createRemoteStrings.call(remotes, auth, config.hostname);

      return asp(request)({
        uri: remotes.apiRemoteString + 'user',
        headers: {
          'User-Agent': 'jspm',
          'Accept': 'application/vnd.github.v3+json'
        },
        followRedirect: false,
        strictSSL: 'strictSSL' in config ? config.strictSSL : true
      });
    })
    .then(function(res) {
      if (res.statusCode == 401) {
        ui.log('warn', 'Provided GitHub credentials are not authorized, try re-entering your password or access token.');
      }
      else if (res.statusCode != 200) {
        ui.log('warn', 'Invalid response code, %' + res.statusCode + '%');
      }
      else {
        ui.log('ok', 'GitHub authentication is working successfully.');
        return true;
      }
    }, function(err) {
      ui.log('err', err.stack || err);
    });
  })
  .then(function(authorized) {
    if (!authorized)
      return ui.confirm('Would you like to try new credentials?', true)
      .then(function(redo) {
        if (redo)
          return configureCredentials(config, ui);
        return encodeCredentials(auth);
      });
    else if (auth.username)
      return encodeCredentials(auth);
    else
      return null;
  });
}

var apiWarned = false;

// static configuration function
GithubLocation.configure = function(config, ui) {
  config.remote = config.remote || 'https://github.jspm.io';

  return (config.name != 'github' ? Promise.resolve(ui.confirm('Are you setting up a GitHub Enterprise registry?', true)) : Promise.resolve())
  .then(function(enterprise) {
    if (!enterprise)
      return;

    return Promise.resolve(ui.input('Enter the hostname of your GitHub Enterprise server', config.hostname))
    .then(function(hostname) {
      config.hostname = hostname;
    });
  })
  .then(function() {
    return Promise.resolve(ui.confirm('Would you like to set up your GitHub credentials?', true))
    .then(function(auth) {
      if (auth)
        return configureCredentials(config, ui)
        .then(function(auth) {
          config.auth = auth;
        });
      });
  })
  .then(function() {
    config.maxRepoSize = config.maxRepoSize || 0;
    return config;
  });
};

GithubLocation.packageNameFormats = ['*/*'];

GithubLocation.prototype = {

  // given a repo name, locate it and ensure it exists
  locate: function(repo) {
    var self = this;
    var remoteString = this.remoteString;

    if (repo.split('/').length !== 2)
      throw "GitHub packages must be of the form `owner/repo`.";

    // request the repo to check that it isn't a redirect
    return new Promise(function(resolve, reject) {
      request(extend({
        uri: remoteString + repo,
        headers: {
          'User-Agent': 'jspm'
        },
        followRedirect: false
      }, self.defaultRequestOptions
      ))
      .on('response', function(res) {
        // redirect
        if (res.statusCode == 301)
          resolve({ redirect: self.name + ':' + res.headers.location.split('/').splice(3).join('/') });

        if (res.statusCode == 401)
          reject('Invalid authentication details.\n' +
            'Run %jspm registry config ' + self.name + '% to reconfigure the credentials, or update them in your ~/.netrc file.');

        // it might be a private repo, so wait for the lookup to fail as well
        if (res.statusCode == 404 || res.statusCode == 200 || res.statusCode === 302)
          resolve();

        reject(new Error('Invalid status code ' + res.statusCode + '\n' + JSON.stringify(res.headers, null, 2)));
      })
      .on('error', function(error) {
        if (typeof error == 'string') {
          error = new Error(error);
          error.hideStack = true;
        }
        error.retriable = true;
        reject(error);
      });
    });
  },

  // return values
  // { versions: { versionhash } }
  // { notfound: true }
  lookup: function(repo) {
    var execOpt = this.execOpt;
    var remoteString = this.remoteString;
    return new Promise(function(resolve, reject) {
      execGit('ls-remote ' + remoteString.replace(/(['"()])/g, '\\\$1') + repo + '.git refs/tags/* refs/heads/*', execOpt, function(err, stdout, stderr) {
        if (err) {
          if (err.toString().indexOf('not found') == -1) {
            // dont show plain text passwords in error
            var error = new Error(stderr.toString().replace(remoteString, ''));
            error.hideStack = true;
            error.retriable = true;
            reject(error);
          }
          else
            resolve({ notfound: true });
        }

        versions = {};
        var refs = stdout.split('\n');
        for (var i = 0; i < refs.length; i++) {
          if (!refs[i])
            continue;

          var hash = refs[i].substr(0, refs[i].indexOf('\t'));
          var refName = refs[i].substr(hash.length + 1);
          var version;
          var versionObj = { hash: hash, meta: {} };

          if (refName.substr(0, 11) == 'refs/heads/') {
            version = refName.substr(11);
            versionObj.stable = false;
          }

          else if (refName.substr(0, 10) == 'refs/tags/') {
            if (refName.substr(refName.length - 3, 3) == '^{}')
              version = refName.substr(10, refName.length - 13);
            else
              version = refName.substr(10);

            if (version.substr(0, 1) == 'v' && semver.valid(version.substr(1))) {
              version = version.substr(1);
              // note when we remove a "v" which versions we need to add it back to
              // to work out the tag version again
              versionObj.meta.vPrefix = true;
            }
          }

          versions[version] = versionObj;
        }

        resolve({ versions: versions });
      });
    });
  },

  // optional hook, allows for quicker dependency resolution
  // since download doesn't block dependencies
  getPackageConfig: function(repo, version, hash, meta) {
    if (meta.vPrefix)
      version = 'v' + version;

    var self = this;
    var ui = this.ui;

    return asp(request)({
      uri: this.apiRemoteString + 'repos/' + repo + '/contents/package.json',
      headers: {
        'User-Agent': 'jspm',
        'Accept': 'application/vnd.github.v3.raw'
      },
      qs: {
        ref: version
      },
      strictSSL: this.defaultRequestOptions.strictSSL
    }).then(function(res) {
      // API auth failure warnings
      function apiFailWarn(reason, showAuthCommand) {
        if (apiWarned)
          return;

        ui.log('warn', 'Unable to use the GitHub API to speed up dependency downloads due to ' + reason
            + (showAuthCommand ? '\nTo resolve use %jspm registry config github% to configure the credentials, or update them in your ~/.netrc file.' : ''));
        apiWarned = true;
      }
      
      if (res.headers.status.match(/^401/))
        return apiFailWarn('lack of authorization', true);
      if (res.headers.status.match(/^406/))
        return apiFailWarn('insufficient permissions. Ensure you have public_repo access.');
      if (res.headers['x-ratelimit-remaining'] == '0') {
        if (self.auth)
          return apiFailWarn('the rate limit being reached, which will be reset in `' + 
              Math.round((res.headers['x-ratelimit-reset'] * 1000 - new Date(res.headers.date).getTime()) / 60000) + ' minutes`.');
        return apiFailWarn('the rate limit being reached.', true);
      }
      if (res.statusCode != 200)
        return apiFailWarn('invalid response code ' + res.statusCode + '.');

      // it is quite valid for a repo not to have a package.json
      if (res.statusCode == 404)
        return {};

      var packageJSON;
      try {
        packageJSON = JSON.parse(res.body);
      }
      catch(e) {
        throw 'Error parsing package.json';
      }

      return packageJSON;
    });
  },

  processPackageConfig: function(packageConfig, packageName) {
    if (!packageConfig.jspm || !packageConfig.jspm.files)
      delete packageConfig.files;

    var self = this;

    if ((packageConfig.dependencies || packageConfig.peerDependencies || packageConfig.optionalDependencies) && 
        !packageConfig.registry && (!packageConfig.jspm || !(packageConfig.jspm.dependencies || packageConfig.jspm.peerDependencies || packageConfig.jspm.optionalDependencies))) {
      var hasDependencies = false;
      for (var p in packageConfig.dependencies)
        hasDependencies = true;
      for (var p in packageConfig.peerDependencies)
        hasDependencies = true;
      for (var p in packageConfig.optionalDependencies)
        hasDependencies = true;

      if (packageName && hasDependencies) {
        var looksLikeNpm = packageConfig.name && packageConfig.version && (packageConfig.description || packageConfig.repository || packageConfig.author || packageConfig.license || packageConfig.scripts);
        var isSemver = semver.valid(packageName.split('@').pop());
        var noDepsMsg;

        // non-semver npm installs on GitHub can be permitted as npm branch-tracking installs
        if (looksLikeNpm) {
          if (!isSemver)
            noDepsMsg = 'To install this package as it would work on npm, install with a registry override via %jspm install ' + packageName + ' -o "{registry:\'npm\'}"%.'
          else
            noDepsMsg = 'If the dependencies aren\'t needed ignore this message. Alternatively set a `registry` or `dependencies` override or use the npm registry version at %jspm install npm:' + packageConfig.name + '@^' + packageConfig.version + '% instead.';
        }
        else {
          noDepsMsg = 'If this is your own package, add `"registry": "jspm"` to the package.json to ensure the dependencies are installed.'
        }

        if (noDepsMsg) {
          delete packageConfig.dependencies;
          delete packageConfig.peerDependencies;
          delete packageConfig.optionalDependencies;
          this.ui.log('warn', '`' + packageName + '` dependency installs skipped as it\'s a GitHub package with no registry property set.\n' + noDepsMsg + '\n');
        }
      }
      else {
        delete packageConfig.dependencies;
        delete packageConfig.peerDependencies;
        delete packageConfig.optionalDependencies;
      }
    }

    // on GitHub, single package names ('jquery') are from jspm registry
    // double package names ('components/jquery') are from github registry
    if (!packageConfig.registry || packageConfig.registry == 'github') {
      for (var d in packageConfig.dependencies)
        packageConfig.dependencies[d] = convertDependency(d, packageConfig.dependencies[d]);
      for (var d in packageConfig.peerDependencies)
        packageConfig.peerDependencies[d] = convertDependency(d, packageConfig.peerDependencies[d]);
      for (var d in packageConfig.optionalDependencies)
        packageConfig.optionalDependencies[d] = convertDependency(d, packageConfig.optionalDependencies[d]);

      function convertDependency(d, depName) {
        var depVersion;

        if (depName.indexOf(':') != -1)
          return depName;

        if (depName.indexOf('@') != -1) {
          depVersion = depName.substr(depName.indexOf('@') + 1);
          depName = depName.substr(0, depName.indexOf('@'));
        }
        else {
          depVersion = depName;
          depName = d;
        }

        if (depName.split('/').length == 1)
          return 'jspm:' + depName + (depVersion && depVersion !== true ? '@' + depVersion : '');

        return depName + '@' + depVersion;
      }
    }
    return packageConfig;
  },

  download: function(repo, version, hash, meta, outDir) {
    if (meta.vPrefix)
      version = 'v' + version;

    var execOpt = this.execOpt;
    var max_repo_size = this.max_repo_size;
    var remoteString = this.remoteString;

    var self = this;

    // Download from the git archive
    return new Promise(function(resolve, reject) {
      request({
        uri: remoteString + repo + '/archive/' + version + '.tar.gz',
        headers: { 'accept': 'application/octet-stream' },
        strictSSL: self.defaultRequestOptions.strictSSL
      })
      .on('response', function(pkgRes) {
        if (pkgRes.statusCode != 200)
          return reject('Bad response code ' + pkgRes.statusCode);

        if (max_repo_size && pkgRes.headers['content-length'] > max_repo_size)
          return reject('Response too large.');

        pkgRes.pause();

        var gzip = zlib.createGunzip();

        pkgRes
        .pipe(gzip)
        .pipe(tar.extract(outDir, {
          strip: 1,
          filter: function(_, header) {
            return header.type !== 'file' && header.type !== 'directory'
          }
        }).on('finish', resolve).on('error', reject))
        .on('error', reject);

        pkgRes.resume();

      })
      .on('error', function(err) {
        if (err.code == 'ECONNRESET')
          err.retriable = true;
        throw err;
      });
    });
  },

  // check if the main entry point exists. If not, try the bower.json main.
  processPackage: function(packageConfig, packageName, dir) {
    var main = packageConfig.main || dir.split('/').pop().split('@').slice(0, -1).join('@') + (dir.substr(dir.length - 3, 3) != '.js' ? '.js' : '');
    var libDir = packageConfig.directories && (packageConfig.directories.dist || packageConfig.directories.lib) || '.';

    if (main instanceof Array)
      main = main[0];

    if (typeof main != 'string')
      return packageConfig;

    // convert to windows-style paths if necessary
    main = main.replace(/\//g, path.sep);
    libDir = libDir.replace(/\//g, path.sep);

    if (main.indexOf('!') != -1)
      return;

    function checkMain(main, libDir) {
      if (!main)
        return Promise.resolve(false);

      if (main.substr(main.length - 3, 3) == '.js')
        main = main.substr(0, main.length - 3);

      return new Promise(function(resolve, reject) {
        fs.exists(path.resolve(dir, libDir || '.', main) + '.js', function(exists) {
          resolve(exists);
        });
      });
    }

    return checkMain(main, libDir)
    .then(function(hasMain) {
      if (hasMain)
        return hasMain;

      return asp(fs.readFile)(path.resolve(dir, 'bower.json'))
      .then(function(bowerJson) {
        try {
          bowerJson = JSON.parse(bowerJson);
        }
        catch(e) {
          return;
        }

        main = bowerJson.main || '';
        if (main instanceof Array)
          main = main[0];

        return checkMain(main);
      }, function() {})
      .then(function(hasBowerMain) {
        if (hasBowerMain)
          return hasBowerMain;

        main = 'index';
        return checkMain(main, libDir);
      });
    })
    .then(function(hasMain) {
      if (hasMain)
        packageConfig.main = main.replace(/\\/g, '/');
      return packageConfig;
    });
  }

};

module.exports = GithubLocation;
