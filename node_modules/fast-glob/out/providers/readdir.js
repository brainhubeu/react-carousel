'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const readdir = require("readdir-enhanced");
const micromatch = require("micromatch");
function isEnoentCodeError(err) {
    return err.code === 'ENOENT';
}
function filter(entry, patterns, options) {
    if ((options.onlyFiles && !entry.isFile()) || (options.onlyDirs && !entry.isDirectory())) {
        return false;
    }
    if (micromatch(entry.path, patterns).length !== 0) {
        return true;
    }
    return false;
}
function async(task, options) {
    const cwd = path.resolve(options.cwd, task.base);
    const entries = [];
    const api = options.stats ? readdir.readdirStreamStat : readdir.stream;
    const cb = options.transform ? options.transform : (entry) => entry;
    return new Promise((resolve, reject) => {
        const stream = api(cwd, {
            filter: (entry) => filter(entry, task.patterns, options),
            basePath: task.base === '.' ? '' : task.base,
            deep: options.deep,
            sep: '/'
        });
        stream.on('data', (entry) => entries.push(cb(entry)));
        stream.on('error', (err) => isEnoentCodeError(err) ? resolve([]) : reject(err));
        stream.on('end', () => resolve(entries));
    });
}
exports.async = async;
function sync(task, options) {
    const cwd = path.resolve(options.cwd, task.base);
    try {
        const api = options.stats ? readdir.readdirSyncStat : readdir.sync;
        const cb = options.transform ? options.transform : (entry) => entry;
        const entries = api(cwd, {
            filter: (entry) => filter(entry, task.patterns, options),
            basePath: task.base === '.' ? '' : task.base,
            deep: options.deep,
            sep: '/'
        });
        return options.transform ? entries.map(cb) : entries;
    }
    catch (err) {
        if (isEnoentCodeError(err)) {
            return [];
        }
        throw err;
    }
}
exports.sync = sync;
