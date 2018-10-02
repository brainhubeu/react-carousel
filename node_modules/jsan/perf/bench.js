var jsan = require('../');
var decycle = require('../lib/cycle').decycle;

var CircularJSON = require('circular-json');
var stringify = require('json-stringify-safe');

var Benchmark = require('benchmark');

var decycledGlobal = decycle(global, {});

const suite = (name, obj) => () => {
  return new Promise(function(resolve) {
    var hzs = []
    console.log(name)
    new Benchmark.Suite(name)
      .add('jsan', () => jsan.stringify(obj))
      .add('CircularJSON', () => CircularJSON.stringify(obj))
      .add('json-stringify-safe', () => stringify(obj))
      .on('cycle', event => {
        hzs.push(event.target.hz)
        console.log(String(event.target))
      })
      .on('complete', function() {
        var fastest = this.filter('fastest')[0];
        hzs = hzs.sort().reverse();
        console.log(fastest.name, 'is', ((hzs[0] / hzs[1]) * 100).toFixed(2) + '% faster then the 2nd best');
        console.log(fastest.name, 'is', ((hzs[0] / hzs[2]) * 100).toFixed(2) + '% faster then the 3rd best');
        console.log()
        resolve();
      })
      .run({ 'async': true })
    ;
  });
};

var obj = {x: 1, y: 2, z: 3};
obj.self = obj;

var arr = ['x', 'y', 123, 'z'];
arr.push(arr);


Promise.resolve()
  .then(suite('global', global))
  .then(suite('decycledGlobal', decycledGlobal))
  .then(suite('empty object', {}))
  .then(suite('empty array', []))

  .then(suite('small object', {x: 1, y: 2, z: 3}))
  .then(suite('self referencing small object', obj))

  .then(suite('small array', ['x', 'y', 123, 'z']))
  .then(suite('self referencing small array', arr))

  .then(suite('string', 'this" is \' a test\t\n'))
  .then(suite('number', 1234))
  .then(suite('null', null))
