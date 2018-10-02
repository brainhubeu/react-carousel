'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("./utils/task");
const readdir = require("./providers/readdir");
const bash = require("./providers/bash");
function assertPatternsInput(patterns) {
    if (!patterns.every((pattern) => typeof pattern === 'string')) {
        throw new TypeError('patterns must be a string or an array of strings');
    }
}
function prepareInput(source, options) {
    const patterns = [].concat(source);
    assertPatternsInput(patterns);
    options = Object.assign({
        cwd: process.cwd(),
        deep: true,
        stats: false,
        onlyFiles: false,
        onlyDirs: false,
        bashNative: ['darwin', 'linux'],
        transform: null
    }, options);
    if (!options.cwd) {
        options.cwd = process.cwd();
    }
    if (!options.ignore) {
        options.ignore = [];
    }
    else if (options.ignore) {
        options.ignore = [].concat(options.ignore);
    }
    return {
        patterns,
        options,
        api: (options.bashNative.indexOf(process.platform) === -1) ? readdir : bash
    };
}
function async(source, options) {
    const input = prepareInput(source, options);
    return Promise.all(task.generateTasks(input.patterns, input.options).map((task) => input.api.async(task, input.options)))
        .then((entries) => entries.reduce((res, to) => [].concat(res, to), []));
}
exports.default = async;
function sync(source, options) {
    const input = prepareInput(source, options);
    return task.generateTasks(input.patterns, input.options)
        .map((task) => input.api.sync(task, input.options))
        .reduce((res, to) => [].concat(res, to), []);
}
exports.sync = sync;
