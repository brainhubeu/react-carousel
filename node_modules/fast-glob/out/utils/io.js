'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function statFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) {
                return reject(err);
            }
            resolve(stat);
        });
    });
}
exports.statFile = statFile;
