'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function isNegative(pattern) {
    return pattern[0] === '!';
}
exports.isNegative = isNegative;
function getNegativeAsPositive(patterns) {
    const results = [];
    for (let i = 0; i < patterns.length; i++) {
        if (isNegative(patterns[i])) {
            results.push(patterns[i].slice(1));
        }
    }
    return results;
}
exports.getNegativeAsPositive = getNegativeAsPositive;
