import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import fileExists from 'file-exists';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Plugin', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const optionsPath = path.join(fixtureDir, 'options.js');
      const exceptionPath = path.join(fixtureDir, 'exception.txt');
      const options = {
        babelrc: false,
        plugins: [plugin]
      };

      if (fileExists(optionsPath)) {
        options.plugins = [[plugin, require(optionsPath)]];
      }

      if (fileExists(exceptionPath)) {
        const exception = fs.readFileSync(exceptionPath).toString();

        assert.throws(() => {
          transformFileSync(actualPath, options);
        }, new RegExp(exception));
      } else {
        const actual = transformFileSync(actualPath, options).code;
        const expected = fs.readFileSync(
            path.join(fixtureDir, 'expected.js')
        ).toString();

        assert.equal(trim(actual), trim(expected));
      }
    });
  });
});
