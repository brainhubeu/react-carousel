'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const bglob = require("bash-glob");
const micromatch = require("micromatch");
const io_1 = require("../utils/io");
const patterns_1 = require("../utils/patterns");
function filterByNegativePatterns(files, patterns) {
    const negativePatterns = patterns_1.getNegativeAsPositive(patterns);
    const entries = [];
    for (let i = 0; i < files.length; i++) {
        if (micromatch(files[i], negativePatterns).length === 0) {
            entries.push(files[i]);
        }
    }
    return entries;
}
function async(task, options) {
    const patterns = task.patterns.filter((pattern) => !patterns_1.isNegative(pattern));
    const cb = options.transform ? options.transform : (entry) => entry;
    return new Promise((resolve, reject) => {
        bglob(patterns, { cwd: options.cwd, dotglob: true }, (err, files) => {
            if (err) {
                return reject(err);
            }
            const entries = filterByNegativePatterns(files, task.patterns);
            if (options.stats || options.onlyFiles || options.onlyDirs) {
                return Promise.all(entries.map(io_1.statFile)).then((stats) => {
                    const results = [];
                    for (let i = 0; i < stats.length; i++) {
                        const entry = stats[i];
                        if ((options.onlyFiles && !entry.isFile()) || (options.onlyDirs && !entry.isDirectory())) {
                            continue;
                        }
                        entry.path = entries[i];
                        results.push(cb(options.stats ? entry : entry.path));
                    }
                    resolve(results);
                });
            }
            resolve(options.transform ? entries.map(cb) : entries);
        });
    });
}
exports.async = async;
function sync(task, options) {
    const patterns = task.patterns.filter((pattern) => !patterns_1.isNegative(pattern));
    const cb = options.transform ? options.transform : (entry) => entry;
    const files = bglob.sync(patterns, { cwd: options.cwd, dotglob: true });
    const entries = filterByNegativePatterns(files, task.patterns);
    if (options.stats || options.onlyFiles || options.onlyDirs) {
        const results = [];
        for (let i = 0; i < entries.length; i++) {
            const entry = fs.statSync(entries[i]);
            if ((options.onlyFiles && !entry.isFile()) || (options.onlyDirs && !entry.isDirectory())) {
                continue;
            }
            entry.path = entries[i];
            results.push(cb(options.stats ? entry : entry.path));
        }
        return results;
    }
    return options.transform ? entries.map(cb) : entries;
}
exports.sync = sync;
