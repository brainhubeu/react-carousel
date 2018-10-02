'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const globParent = require("glob-parent");
function generateTasks(patterns, options) {
    const tasks = [];
    const parents = {};
    const negativePatterns = options.ignore;
    // Compose patterns by common grounds
    patterns.forEach((pattern) => {
        if (pattern[0] === '!') {
            negativePatterns.push(pattern.slice(1));
            return;
        }
        const parent = globParent(pattern);
        if (parents.hasOwnProperty(parent)) {
            parents[parent].push(pattern);
        }
        else {
            parents[parent] = [pattern];
        }
    });
    // Expand negative patterns to exclude directories
    negativePatterns.forEach((pattern) => {
        if (pattern.endsWith('/**')) {
            negativePatterns.push(pattern.replace(/(\/\*\*)+$/, ''));
        }
    });
    Object.keys(parents).forEach((parent) => {
        const negative = [];
        negativePatterns.forEach((pattern) => {
            let gPattern = pattern;
            if (parent === '.') {
                gPattern = '!' + pattern;
            }
            else {
                gPattern = pattern.startsWith(parent) ? '!' + pattern : `!${parent}/${pattern}`;
            }
            if (negative.indexOf(gPattern) === -1) {
                negative.push(gPattern);
            }
        });
        tasks.push({
            base: parent,
            patterns: [].concat(parents[parent], negative)
        });
    });
    return tasks;
}
exports.generateTasks = generateTasks;
