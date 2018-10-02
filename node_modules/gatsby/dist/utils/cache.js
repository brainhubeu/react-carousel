"use strict";

var Promise = require(`bluebird`);
var low = require(`lowdb`);
var fs = require(`fs-extra`);
var _ = require(`lodash`);

var db = void 0;
var directory = void 0;

/**
 * Initialize cache store. Reuse existing store if available.
 */
exports.initCache = function () {
  fs.ensureDirSync(`${process.cwd()}/.cache/cache`);
  if (process.env.NODE_ENV === `test`) {
    directory = require(`os`).tmpdir();
  } else {
    directory = process.cwd() + `/.cache/cache`;
  }
  db = low(null, {
    format: {
      serialize: function serialize(obj) {
        return JSON.stringify(obj);
      },
      deserialize: function deserialize(str) {
        return JSON.parse(str);
      }
    }
  });
  db._.mixin(require(`lodash-id`));

  var previousState = void 0;
  try {
    previousState = JSON.parse(fs.readFileSync(`${directory}/db.json`));
  } catch (e) {
    // ignore
  }

  if (previousState) {
    db.defaults(previousState).write();
  } else {
    db.defaults({ keys: [] }).write();
  }
};

/**
 * Get value of key
 * @param key
 * @returns {Promise}
 */
exports.get = function (key) {
  return new Promise(function (resolve, reject) {
    var pair = void 0;
    try {
      pair = db.get(`keys`).getById(key).value();
    } catch (e) {
      // ignore
    }

    if (pair) {
      resolve(pair.value);
    } else {
      resolve();
    }
  });
};

/**
 * Create or update key with value
 * @param key
 * @param value
 * @returns {Promise} - Promise object which resolves to 'Ok' if successful.
 */
exports.set = function (key, value) {
  return new Promise(function (resolve, reject) {
    db.get(`keys`).upsert({ id: key, value }).write();
    save();
    resolve(`Ok`);
  });
};

var save = void 0;

if (process.env.NODE_ENV !== `test`) {
  save = _.debounce(function () {
    fs.writeFile(`${directory}/db.json`, JSON.stringify(db.getState()));
  }, 250);
} else {
  save = _.noop;
}
//# sourceMappingURL=cache.js.map